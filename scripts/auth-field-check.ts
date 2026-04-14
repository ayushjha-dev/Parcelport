import { loginSchema, registerSchema } from '../src/lib/validations/auth';

type TestCase = {
  name: string;
  run: () => boolean;
};

const validRegisterData = {
  full_name: 'Rahul Sharma',
  email: 'rahul.sharma@university.edu',
  mobile_number: '9876543210',
  student_roll_no: '2024CS102',
  course_branch: 'btech-cse',
  hostel_block: 'a',
  floor_number: '4',
  room_number: '412',
  password: 'StrongPass1',
  confirm_password: 'StrongPass1',
};

const testCases: TestCase[] = [
  {
    name: 'login: valid email/password passes',
    run: () => loginSchema.safeParse({ email: 'user@example.com', password: 'StrongPass1' }).success,
  },
  {
    name: 'login: invalid email fails',
    run: () => !loginSchema.safeParse({ email: 'not-an-email', password: 'StrongPass1' }).success,
  },
  {
    name: 'login: short password fails',
    run: () => !loginSchema.safeParse({ email: 'user@example.com', password: 'short' }).success,
  },
  {
    name: 'register: valid payload passes',
    run: () => registerSchema.safeParse(validRegisterData).success,
  },
  {
    name: 'register: full_name characters validation works',
    run: () => !registerSchema.safeParse({ ...validRegisterData, full_name: 'Rahul123' }).success,
  },
  {
    name: 'register: email validation works',
    run: () => !registerSchema.safeParse({ ...validRegisterData, email: 'invalid-email' }).success,
  },
  {
    name: 'register: mobile number validation works',
    run: () => !registerSchema.safeParse({ ...validRegisterData, mobile_number: '12345' }).success,
  },
  {
    name: 'register: student_roll_no required validation works',
    run: () => !registerSchema.safeParse({ ...validRegisterData, student_roll_no: '' }).success,
  },
  {
    name: 'register: course_branch required validation works',
    run: () => !registerSchema.safeParse({ ...validRegisterData, course_branch: '' }).success,
  },
  {
    name: 'register: hostel_block required validation works',
    run: () => !registerSchema.safeParse({ ...validRegisterData, hostel_block: '' }).success,
  },
  {
    name: 'register: floor_number required validation works',
    run: () => !registerSchema.safeParse({ ...validRegisterData, floor_number: '' }).success,
  },
  {
    name: 'register: room_number format validation works',
    run: () => !registerSchema.safeParse({ ...validRegisterData, room_number: 'Room 4A' }).success,
  },
  {
    name: 'register: password strength validation works',
    run: () => !registerSchema.safeParse({ ...validRegisterData, password: 'weakpass', confirm_password: 'weakpass' }).success,
  },
  {
    name: 'register: confirm_password match validation works',
    run: () => !registerSchema.safeParse({ ...validRegisterData, confirm_password: 'DifferentPass1' }).success,
  },
];

let passed = 0;

for (const testCase of testCases) {
  const ok = testCase.run();
  if (ok) {
    passed += 1;
    console.log(`PASS: ${testCase.name}`);
  } else {
    console.error(`FAIL: ${testCase.name}`);
  }
}

console.log(`\n${passed}/${testCases.length} auth field checks passed.`);

if (passed !== testCases.length) {
  process.exit(1);
}
