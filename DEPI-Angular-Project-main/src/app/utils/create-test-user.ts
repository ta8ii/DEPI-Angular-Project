/**
 * Utility script to create a test user with all courses purchased
 * Run this in browser console or call createTestUser() function
 */

export function createTestUser() {
  // Test User Credentials
  const testUser = {
    id: 'test-user-001',
    firstName: 'Test',
    lastName: 'User',
    email: 'test@student.com',
    Email: 'test@student.com', // For compatibility
    password: '12345678',
    phone: '01234567890',
    role: 'student',
    avatar: ''
  };

  // Get existing users
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  
  // Check if user already exists
  const existingUserIndex = users.findIndex((u: any) => 
    (u.email || u.Email || '').toLowerCase() === testUser.email.toLowerCase()
  );

  if (existingUserIndex >= 0) {
    // Update existing user
    users[existingUserIndex] = { ...users[existingUserIndex], ...testUser };
  } else {
    // Add new user
    users.push(testUser);
  }

  // Save users
  localStorage.setItem('users', JSON.stringify(users));

  // Create AuthUser object
  const authUser = {
    id: testUser.id,
    name: `${testUser.firstName} ${testUser.lastName}`,
    email: testUser.email,
    role: testUser.role,
    avatar: testUser.avatar,
    token: `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  };

  // Save as logged in user
  localStorage.setItem('auth_user', JSON.stringify(authUser));

  // Purchase ALL courses (IDs: 1, 2, 3, 4, 5, 6)
  const allCourseIds = ['1', '2', '3', '4', '5', '6'];
  localStorage.setItem(
    `purchased_courses_${testUser.id}`,
    JSON.stringify(allCourseIds)
  );

  console.log('✅ Test User Created Successfully!');
  console.log('📧 Email:', testUser.email);
  console.log('🔑 Password:', testUser.password);
  console.log('📚 Purchased Courses:', allCourseIds);
  console.log('👤 User ID:', testUser.id);
  console.log('🎯 Role:', testUser.role);

  return {
    email: testUser.email,
    password: testUser.password,
    userId: testUser.id,
    courses: allCourseIds
  };
}

// Auto-create on import (for development)
if (typeof window !== 'undefined') {
  // Uncomment the line below to auto-create the test user
  // createTestUser();
}

