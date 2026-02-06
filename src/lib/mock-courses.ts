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
          { id: 'android-l1', title: 'Introduction to Kotlin', type: 'text', content: 'Kotlin is a modern, cross-platform, statically typed, general-purpose programming language with type inference. It is designed to interoperate fully with Java, and the JVM version of Kotlin\'s standard library depends on the Java Class Library, but type inference allows its syntax to be more concise. This module will cover the foundational concepts like variables (val for immutable, var for mutable), basic data types (Int, String, Boolean), and how to write your first "Hello, World!" program. We will also touch upon null safety, a key feature of Kotlin that helps to prevent null pointer exceptions.' },
          { id: 'android-l2', title: 'Functions and Classes', type: 'text', content: 'In Kotlin, functions are declared with the `fun` keyword. We will explore how to define functions with parameters and return values. Classes are blueprints for creating objects. This lesson covers creating simple classes, understanding properties and initializers, and the difference between primary and secondary constructors. We will also introduce data classes, which are a concise way to create classes that just hold data.' },
        ],
      },
      {
        id: 'android-m2',
        title: 'Building User Interfaces',
        lessons: [
          { id: 'android-l3', title: 'Intro to Jetpack Compose', type: 'video', content: 'f2bE-c_qa3Y' },
          { id: 'android-l4', title: 'Layouts, Modifiers, and State', type: 'text', content: 'Compose builds UIs by nesting composable functions. We will learn about core layout components like Column (arranges children vertically), Row (arranges children horizontally), and Box (stacks children on top of each other). Modifiers are used to decorate or add behavior to Composables, such as setting padding, size, or background color. We will also dive into managing UI state using `remember` and `mutableStateOf` to make our UI dynamic and interactive.' },
        ],
      },
      {
        id: 'android-m3',
        title: 'App Architecture',
        lessons: [
            { id: 'android-l5', title: 'Activities & Navigation', type: 'video', content: '3oQ1vS1aK-c' },
            { id: 'android-l6', title: 'MVVM with ViewModels', type: 'text', content: 'The Model-View-ViewModel (MVVM) architecture pattern separates UI logic from business logic, improving modularity and testability. ViewModels are used to store and manage UI-related data in a lifecycle-conscious way, meaning they survive configuration changes like screen rotations. We will learn how to use `ViewModel` and `LiveData` or `StateFlow` to expose data to the UI and handle user events.'}
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
                { id: 'py-l1', title: 'Introduction to Python', type: 'video', content: '_uQrJ0TkZlc' },
                { id: 'py-l2', title: 'Data Structures in Python', type: 'text', content: 'Python includes several powerful built-in data structures. Lists are ordered, mutable collections (e.g., `[1, 2, 3]`). Tuples are ordered and immutable (e.g., `(1, 2, 3)`). Dictionaries are unordered key-value pairs (e.g., `{"name": "John", "age": 30}`). Sets are unordered collections of unique items. Mastering these is essential for organizing and storing data efficiently in any Python program.'}
            ]
        },
        {
            id: 'py-m2',
            title: 'Control Flow and Functions',
            lessons: [
              { id: 'py-l3', title: 'Conditional Statements and Loops', type: 'video', content: 'OnurGvYYR1k' },
              { id: 'py-l4', title: 'Writing Your Own Functions', type: 'text', content: 'Functions are reusable blocks of code that perform a specific task, defined using the `def` keyword. They help to make your code more modular, organized, and easier to debug by breaking down complex problems into smaller, manageable pieces. We will cover how to define functions, pass arguments, and return values.'}
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
                { id: 'cs-l1', title: 'The Threat Landscape', type: 'video', content: 'inWWhr5tnEA' },
                { id: 'cs-l2', title: 'Core Security Principles (CIA Triad)', type: 'text', content: 'The CIA Triad (Confidentiality, Integrity, Availability) is a foundational model for guiding information security policies. Confidentiality ensures that data is accessible only to authorized users. Integrity ensures that data is accurate and trustworthy. Availability ensures that data and services are accessible when needed. Understanding this triad is crucial for identifying vulnerabilities and implementing effective security measures.'}
            ]
        },
        {
            id: 'cs-m2',
            title: 'Network & Web Security',
            lessons: [
              { id: 'cs-l3', title: 'Common Web Attacks', type: 'text', content: 'Web applications are common targets for attackers. Cross-Site Scripting (XSS) involves injecting malicious scripts into trusted websites, which then execute on a victim\'s browser. SQL Injection (SQLi) is an attack where malicious SQL code is inserted into a query to manipulate a database. Understanding how these attacks work is the first step to preventing them through proper input validation and other defensive coding practices.' },
              { id: 'cs-l4', title: 'Firewalls and Intrusion Detection', type: 'text', content: 'Firewalls act as a barrier between a trusted internal network and an untrusted external network (like the internet), controlling incoming and outgoing traffic based on a set of security rules. Intrusion Detection Systems (IDS) monitor network or system activities for malicious activities or policy violations and produce reports to a management station.'}
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
                { id: 'dcn-l1', title: 'What is a Computer Network?', type: 'video', content: '3QhU9jd03a0' },
                { id: 'dcn-l2', title: 'The OSI Model Explained', type: 'text', content: 'The Open Systems Interconnection (OSI) model is a conceptual framework that standardizes the functions of a telecommunication or computing system into seven abstract layers. These layers are: Physical, Data Link, Network, Transport, Session, Presentation, and Application. This model helps in understanding and troubleshooting network problems by providing a clear separation of functions.'}
            ]
        },
        {
            id: 'dcn-m2',
            title: 'The TCP/IP Protocol Suite',
            lessons: [
                { id: 'dcn-l3', title: 'Understanding TCP and UDP', type: 'video', content: 'u-qs8gEcmGE' },
                { id: 'dcn-l4', title: 'IP Addressing and Subnetting', type: 'text', content: 'An Internet Protocol (IP) address is a numerical label assigned to each device connected to a computer network that uses the Internet Protocol for communication. IPv4 addresses are 32 bits long. Subnetting is the practice of dividing a network into two or more smaller networks (subnets). This increases security and can improve network performance by reducing the size of the broadcast domain.'}
            ]
        }
    ]
  }
];
