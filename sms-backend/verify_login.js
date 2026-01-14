
const BASE_URL = 'http://localhost:5000/api/auth';

async function testLogin() {
    console.log('--- Starting Verification ---');
    const timestamp = Date.now();
    const email = `testuser_${timestamp}@example.com`;
    const password = 'password123';
    const name = 'Test User';

    // 1. Register a student
    console.log(`\n1. Registering new student: ${email}`);
    try {
        const registerResponse = await fetch(`${BASE_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password, role: 'student' })
        });
        const registerData = await registerResponse.json();

        if (!registerResponse.ok) {
            console.error('Registration failed:', registerData);
            return;
        }
        console.log('Registration successful:', registerData.role);

        // 2. Login as Student (Should Succeed)
        console.log('\n2. Logging in as Student (Correct Role)...');
        const loginStudent = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, role: 'student' })
        });
        const loginStudentData = await loginStudent.json();
        if (loginStudent.ok) {
            console.log('SUCCESS: Logged in as Student.');
        } else {
            console.error('FAILURE: Could not login as Student.', loginStudentData);
        }

        // 3. Login as Teacher (Should Fail)
        console.log('\n3. Logging in as Teacher (Incorrect Role)...');
        const loginTeacher = await fetch(`${BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, role: 'teacher' })
        });
        const loginTeacherData = await loginTeacher.json();
        if (!loginTeacher.ok) {
            console.log('SUCCESS: Login failed as expected:', loginTeacherData.message);
        } else {
            console.error('FAILURE: Unexpectedly logged in as Teacher!', loginTeacherData);
        }

    } catch (error) {
        console.error('Error during verification:', error);
    }
    console.log('\n--- Verification Complete ---');
}

testLogin();
