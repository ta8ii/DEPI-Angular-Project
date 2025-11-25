import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { VideoItem } from './models/video-item';
import { Course } from './models/course';
import { CourseAccessService } from '../../services/course-access.service';
import { AuthService } from '../../services/auth';
import { CoursePlayerService } from './services/course-player.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-course-player',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './course-player.html',
  styleUrl: './course-player.css'
})
export class CoursePlayerPage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('videoPlayer', { static: false }) videoPlayer!: ElementRef<HTMLVideoElement>;

  courseId: string | null = null;
  course: Course | null = null;
  courseVideos: VideoItem[] = [];
  currentVideo: VideoItem | null = null;
  completedVideos: string[] = [];
  
  loading = true;
  error: string | null = null;
  videoLoading = false;
  videoError = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private courseAccessService: CourseAccessService,
    private authService: AuthService,
    private coursePlayerService: CoursePlayerService
  ) {}

  ngOnInit() {
    this.courseId = this.route.snapshot.paramMap.get('id');
    
    if (!this.courseId) {
      this.handleError('Course ID is missing');
      this.router.navigate(['/courses']);
      return;
    }

    this.checkAccessAndLoadCourse();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      if (this.videoPlayer) {
        this.setupVideoListeners();
      }
    }, 0);
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
    this.cleanupVideoListeners();
  }

  private checkAccessAndLoadCourse() {
    // Check if user is logged in
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: `/course/${this.courseId}/player` }
      });
      return;
    }
    
    // Check if user has purchased the course
    if (this.courseId && !this.courseAccessService.hasPurchasedCourse(this.courseId)) {
      this.router.navigate(['/payment', this.courseId], {
        queryParams: { message: 'Please purchase this course to access the content' }
      });
      return;
    }

    this.loadCourseData();
  }


  loadCourseData() {
    if (!this.courseId) return;

    this.loading = true;
    this.error = null;

    // Load course and videos
    const courseSub = this.coursePlayerService.getCourse(this.courseId).subscribe({
      next: (course) => {
        console.log('✅ Course loaded:', course);
        this.course = course;
        this.courseVideos = course.videos || [];
        console.log('📹 Videos loaded:', this.courseVideos.length, 'videos');
        
        // Fallback: If no videos from service, use default videos
        if (this.courseVideos.length === 0) {
          console.warn('⚠️ No videos from service, using default videos');
          this.courseVideos = this.getDefaultVideos();
        }
        
        this.loading = false;

        // Load completion status
        this.loadCompletionStatus();

        // Set first video as default
        if (this.courseVideos.length > 0) {
          this.selectVideo(this.courseVideos[0]);
        } else {
          console.error('❌ No videos available for this course');
        }
      },
      error: (err) => {
        console.error('❌ Error loading course:', err);
        // Use default videos as fallback
        this.courseVideos = this.getDefaultVideos();
        this.course = {
          id: this.courseId || '1',
          title: 'Course Player',
          description: 'Loading course details...',
          videos: this.courseVideos
        };
        this.loading = false;
        
        // Still try to load completion status
        this.loadCompletionStatus();
        
        // Set first video as default if available
        if (this.courseVideos.length > 0) {
          this.selectVideo(this.courseVideos[0]);
        }
      }
    });

    this.subscriptions.push(courseSub);
  }

  private getDefaultVideos(): VideoItem[] {
    return [
      { 
        id: '1', 
        title: 'Introduction to Web Development', 
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4', 
        duration: '02:10' 
      },
      { 
        id: '2', 
        title: 'HTML Fundamentals', 
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4', 
        duration: '05:22' 
      },
      { 
        id: '3', 
        title: 'CSS Styling Basics', 
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', 
        duration: '07:11' 
      },
      { 
        id: '4', 
        title: 'JavaScript Basics', 
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4', 
        duration: '10:30' 
      },
      { 
        id: '5', 
        title: 'React Introduction', 
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4', 
        duration: '12:45' 
      },
      { 
        id: '6', 
        title: 'Node.js Backend', 
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', 
        duration: '15:20' 
      }
    ];
  }

  private loadCompletionStatus() {
    if (!this.courseId) return;

    const user = this.authService.getUser();
    if (!user) return;

    // Load from API and merge with localStorage
    const completionSub = this.coursePlayerService.getCompletionStatus(this.courseId, user.id).subscribe({
      next: (completedIds) => {
        // Merge with localStorage data
        const localKey = `course_${this.courseId}_completed`;
        const localData = localStorage.getItem(localKey);
        
        let localCompleted: string[] = [];
        if (localData) {
          try {
            localCompleted = JSON.parse(localData);
          } catch (e) {
            console.warn('Failed to parse local completion data', e);
          }
        }

        // Merge arrays and remove duplicates
        this.completedVideos = [...new Set([...completedIds, ...localCompleted])];
        this.saveCompletedVideos();
      },
      error: (err) => {
        console.warn('Failed to load completion status from API, using local data', err);
        this.loadCompletedVideos();
      }
    });

    this.subscriptions.push(completionSub);
  }

  private setupVideoListeners() {
    if (!this.videoPlayer?.nativeElement) return;

    const video = this.videoPlayer.nativeElement;
    
    // Remove existing listeners
    this.cleanupVideoListeners();

    // Video ended
    const endedHandler = () => this.onVideoEnded();
    video.addEventListener('ended', endedHandler);
    (video as any)._endedHandler = endedHandler;

    // Video loaded
    const loadedHandler = () => {
      this.videoLoading = false;
      this.videoError = false;
    };
    video.addEventListener('loadeddata', loadedHandler);
    (video as any)._loadedHandler = loadedHandler;

    // Video error
    const errorHandler = () => {
      this.videoError = true;
      this.videoLoading = false;
      this.handleError('Failed to load video. Please check your internet connection.');
    };
    video.addEventListener('error', errorHandler);
    (video as any)._errorHandler = errorHandler;

    // Video loading
    const loadStartHandler = () => {
      this.videoLoading = true;
      this.videoError = false;
    };
    video.addEventListener('loadstart', loadStartHandler);
    (video as any)._loadStartHandler = loadStartHandler;
  }

  private cleanupVideoListeners() {
    if (!this.videoPlayer?.nativeElement) return;

    const video = this.videoPlayer.nativeElement;
    
    if ((video as any)._endedHandler) {
      video.removeEventListener('ended', (video as any)._endedHandler);
    }
    if ((video as any)._loadedHandler) {
      video.removeEventListener('loadeddata', (video as any)._loadedHandler);
    }
    if ((video as any)._errorHandler) {
      video.removeEventListener('error', (video as any)._errorHandler);
    }
    if ((video as any)._loadStartHandler) {
      video.removeEventListener('loadstart', (video as any)._loadStartHandler);
    }
  }

  selectVideo(video: VideoItem) {
    if (!video || !video.url) {
      this.handleError('Invalid video selected');
      return;
    }

    this.currentVideo = video;
    this.videoLoading = true;
    this.videoError = false;

    setTimeout(() => {
      if (this.videoPlayer?.nativeElement) {
        try {
          const videoElement = this.videoPlayer.nativeElement;
          
          // Validate URL
          if (!this.isValidVideoUrl(video.url)) {
            this.handleError('Invalid video URL');
            this.videoError = true;
            return;
          }

          videoElement.src = video.url;
          videoElement.load();
          this.setupVideoListeners();
          
          videoElement.play().catch(err => {
            console.error('Error playing video:', err);
            this.handleError('Failed to play video. Please try again.');
            this.videoError = true;
          });
        } catch (err) {
          this.handleError('Error loading video', err);
          this.videoError = true;
        }
      }
    }, 0);

    // Scroll to active video in list
    setTimeout(() => {
      this.scrollToActiveVideo(video.id);
    }, 100);
  }

  private isValidVideoUrl(url: string): boolean {
    if (!url) return false;
    
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      // If URL parsing fails, check if it's a relative path
      return url.startsWith('/') || url.startsWith('./');
    }
  }

  onVideoEnded() {
    if (this.currentVideo && !this.isVideoCompleted(this.currentVideo.id)) {
      this.markVideoAsCompleted(this.currentVideo.id);
    }
  }

  markVideoAsCompleted(videoId: string) {
    if (!videoId || this.completedVideos.includes(videoId)) return;

    const user = this.authService.getUser();
    if (!user || !this.courseId) return;

    this.completedVideos.push(videoId);
    this.saveCompletedVideos();
    
    // Update via API
    this.coursePlayerService.markVideoCompleted(this.courseId, user.id, videoId).subscribe({
      next: () => {
        this.showToast('Video marked as completed!', 'success');
      },
      error: (err) => {
        console.warn('Failed to update completion status on server', err);
        // Still save locally
      }
    });
    
    // Add animation effect
    setTimeout(() => {
      const videoElement = document.getElementById(`video-item-${videoId}`);
      if (videoElement) {
        videoElement.classList.add('completed-animation');
        setTimeout(() => {
          videoElement.classList.remove('completed-animation');
        }, 1000);
      }
    }, 100);
  }

  isVideoCompleted(videoId: string): boolean {
    return this.completedVideos.includes(videoId);
  }

  private loadCompletedVideos() {
    if (!this.courseId) return;

    const user = this.authService.getUser();
    const key = user 
      ? `course_${this.courseId}_completed_${user.id}`
      : `course_${this.courseId}_completed`;

    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        this.completedVideos = JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to parse completion data', e);
        this.completedVideos = [];
      }
    }
  }

  private saveCompletedVideos() {
    if (!this.courseId) return;

    const user = this.authService.getUser();
    const key = user 
      ? `course_${this.courseId}_completed_${user.id}`
      : `course_${this.courseId}_completed`;

    try {
      localStorage.setItem(key, JSON.stringify(this.completedVideos));
    } catch (e) {
      console.error('Failed to save completion data', e);
    }
  }

  scrollToActiveVideo(videoId: string) {
    try {
      const element = document.getElementById(`video-item-${videoId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } catch (err) {
      console.warn('Failed to scroll to video', err);
    }
  }

  getVideoIndex(video: VideoItem): number {
    if (!video || !this.courseVideos) return 0;
    return this.courseVideos.findIndex(v => v.id === video.id) + 1;
  }

  getCompletionPercentage(): number {
    if (!this.courseVideos || this.courseVideos.length === 0) return 0;
    return Math.round((this.completedVideos.length / this.courseVideos.length) * 100);
  }

  // Auto-handle button clicks and actions
  handleButtonClick(action: string, data?: any) {
    try {
      switch (action) {
        case 'back':
          this.router.navigate(['/courses']);
          break;
        case 'next':
          this.playNextVideo();
          break;
        case 'previous':
          this.playPreviousVideo();
          break;
        case 'replay':
          this.replayCurrentVideo();
          break;
        default:
          this.handleMissingFeature(action);
      }
    } catch (err) {
      this.handleError(`Error handling action: ${action}`, err);
    }
  }

  playNextVideo() {
    if (!this.currentVideo || !this.courseVideos) return;

    const currentIndex = this.courseVideos.findIndex(v => v.id === this.currentVideo?.id);
    if (currentIndex < this.courseVideos.length - 1) {
      this.selectVideo(this.courseVideos[currentIndex + 1]);
    } else {
      this.showToast('You have reached the last video', 'info');
    }
  }

  playPreviousVideo() {
    if (!this.currentVideo || !this.courseVideos) return;

    const currentIndex = this.courseVideos.findIndex(v => v.id === this.currentVideo?.id);
    if (currentIndex > 0) {
      this.selectVideo(this.courseVideos[currentIndex - 1]);
    } else {
      this.showToast('You are at the first video', 'info');
    }
  }

  replayCurrentVideo() {
    if (!this.currentVideo || !this.videoPlayer?.nativeElement) return;

    try {
      const video = this.videoPlayer.nativeElement;
      video.currentTime = 0;
      video.play().catch(err => {
        this.handleError('Failed to replay video', err);
      });
    } catch (err) {
      this.handleError('Error replaying video', err);
    }
  }

  // Error handling
  private handleError(message: string, error?: any) {
    this.error = message;
    console.error(message, error);
    this.showToast(message, 'error');
  }

  // Missing feature handler
  private handleMissingFeature(featureName: string) {
    console.warn(`Feature "${featureName}" is not yet implemented`);
    this.showToast(`Feature "${featureName}" is coming soon!`, 'info');
  }

  // Toast notification
  showToast(message: string, type: 'success' | 'warning' | 'error' | 'info' = 'info') {
    // Simple alert for now - can be replaced with a toast service
    if (type === 'error') {
      console.error(message);
    } else if (type === 'success') {
      console.log('✅', message);
    } else {
      console.log(message);
    }
  }

  // Retry loading video
  retryVideoLoad() {
    if (this.currentVideo) {
      this.selectVideo(this.currentVideo);
    }
  }
}
