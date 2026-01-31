import type { Course } from './types';

export const mockCourses: Course[] = [
  {
    id: 'android',
    title: 'Android Programming',
    description: 'Learn to build native Android apps from scratch using Kotlin and Jetpack Compose.',
    teacher: 'Rohan Kapoor',
    imageId: 'course-android',
    modules: [
      {
        id: 'android-m1',
        title: 'Kotlin Fundamentals',
        lessons: [
          { id: 'android-l1', title: 'Introduction to Kotlin', type: 'video', content: 'prMxgB0n6T0' },
          { id: 'android-l2', title: 'Variables, Functions, and Classes', type: 'text', content: 'Kotlin is a modern, statically typed programming language. We will cover the basics of defining variables (val vs var), creating functions with `fun`, and structuring code with classes.' },
        ],
      },
      {
        id: 'android-m2',
        title: 'Building User Interfaces',
        lessons: [
          { id: 'android-l3', title: 'Intro to Jetpack Compose', type: 'video', content: 'CiiS_9-d3L8' },
          { id: 'android-l4', title: 'Layouts, Modifiers, and State', type: 'text', content: 'Compose builds UIs by nesting composable functions. We will learn about core layout components like Column, Row, and Box, and how to manage UI state with `remember` and `mutableStateOf`.' },
        ],
      },
      {
        id: 'android-m3',
        title: 'App Architecture',
        lessons: [
            { id: 'android-l5', title: 'Activities, Intents, and Navigation', type: 'video', content: 's_p_4KH3sUY' },
            { id: 'android-l6', title: 'MVVM with ViewModels', type: 'text', content: 'The Model-View-ViewModel (MVVM) architecture pattern separates UI logic from business logic. ViewModels are used to store and manage UI-related data in a lifecycle-conscious way.'}
        ]
      },
    ],
  },
  {
    id: 'python',
    title: 'Python for Everybody',
    description: 'Master the fundamentals of programming with Python 3 and build your first applications.',
    teacher: 'Saanvi Desai',
    imageId: 'course-python',
     modules: [
        {
            id: 'py-m1',
            title: 'Python Fundamentals',
            lessons: [
                { id: 'py-l1', title: 'Introduction to Python', type: 'video', content: 'kqtD5dpn9C8' },
                { id: 'py-l2', title: 'Data Structures in Python', type: 'text', content: 'Python includes several built-in data structures, such as lists, tuples, dictionaries, and sets. These are essential for organizing and storing data efficiently.'}
            ]
        },
        {
            id: 'py-m2',
            title: 'Control Flow and Functions',
            lessons: [
              { id: 'py-l3', title: 'Conditional Statements and Loops', type: 'video', content: 'PqFKCq1uyQ0' },
              { id: 'py-l4', title: 'Writing Your Own Functions', type: 'text', content: 'Functions are reusable blocks of code that perform a specific task. They help to make your code more modular, organized, and easier to debug.'}
            ]
        }
    ]
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity Essentials',
    description: 'Learn the fundamentals of cybersecurity, including threat analysis and network security.',
    teacher: 'Dr. Ananya Sharma',
    imageId: 'course-cyber',
     modules: [
        {
            id: 'cs-m1',
            title: 'Introduction to Cybersecurity',
            lessons: [
                { id: 'cs-l1', title: 'The Threat Landscape', type: 'video', content: 'mutLUly04wA' },
                { id: 'cs-l2', title: 'Core Security Principles (CIA Triad)', type: 'text', content: 'The CIA Triad (Confidentiality, Integrity, Availability) is a foundational model for guiding information security policies and identifying vulnerabilities.'}
            ]
        },
        {
            id: 'cs-m2',
            title: 'Network & Web Security',
            lessons: [
              { id: 'cs-l3', title: 'Common Web Attacks (XSS, SQLi)', type: 'video', content: 'YEj5KV2m6eI' },
              { id: 'cs-l4', title: 'Firewalls and Intrusion Detection', type: 'text', content: 'Firewalls act as a barrier between a trusted network and an untrusted network. Intrusion Detection Systems (IDS) monitor network traffic for suspicious activity and issue alerts when such activity is discovered.'}
            ]
        }
    ]
  },
  {
    id: 'dcn',
    title: 'Data Communication and Networking',
    description: 'Understand how data travels across networks, from physical links to application protocols.',
    teacher: 'Vikram Singh',
    imageId: 'course-dcn',
    modules: [
        {
            id: 'dcn-m1',
            title: 'Foundations of Networking',
            lessons: [
                { id: 'dcn-l1', title: 'What is a Computer Network?', type: 'video', content: '03nHeVd_dKk' },
                { id: 'dcn-l2', title: 'The OSI Model Explained', type: 'text', content: 'The Open Systems Interconnection (OSI) model is a conceptual framework that standardizes the functions of a telecommunication or computing system into seven abstract layers.'}
            ]
        },
        {
            id: 'dcn-m2',
            title: 'The TCP/IP Protocol Suite',
            lessons: [
                { id: 'dcn-l3', title: 'Understanding TCP and UDP', type: 'video', content: 'I-grWRg-b_g' },
                { id: 'dcn-l4', title: 'IP Addressing and Subnetting', type: 'text', content: 'An Internet Protocol (IP) address is a numerical label assigned to each device connected to a computer network. Subnetting is the practice of dividing a network into two or more smaller networks.'}
            ]
        }
    ]
  }
];
