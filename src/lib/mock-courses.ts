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
          { id: 'android-l1', title: 'Introduction to Kotlin', type: 'text', content: 'Kotlin is a modern, cross-platform, statically typed, general-purpose programming language with type inference. It is designed to interoperate fully with Java, and the JVM version of Kotlin\'s standard library depends on the Java Class Library, but type inference allows its syntax to be more concise. \n\nKey features we will cover include:\n- **Variables**: `val` for immutable (read-only) variables and `var` for mutable (read-write) variables.\n- **Basic Data Types**: `Int`, `Double`, `String`, `Boolean`, and `Char`.\n- **Null Safety**: Kotlin\'s type system is designed to eliminate the danger of null references, also known as the "billion-dollar mistake". Variables are non-nullable by default, and you must explicitly declare them as nullable using a `?` (e.g., `String?`).\n- **Control Flow**: We\'ll look at `if-else` expressions, `when` statements (a more powerful version of switch), and loops (`for`, `while`).' },
          { id: 'android-l2', title: 'Functions and Classes', type: 'text', content: 'In Kotlin, functions are declared with the `fun` keyword. We will explore how to define functions with parameters and return values. Classes are blueprints for creating objects. This lesson covers creating simple classes, understanding properties and initializers, and the difference between primary and secondary constructors. We will also introduce data classes, which are a concise way to create classes that just hold data, automatically providing `equals()`, `hashCode()`, `toString()`, and more.' },
        ],
      },
      {
        id: 'android-m2',
        title: 'Building User Interfaces',
        lessons: [
          { id: 'android-l3', title: 'Intro to Jetpack Compose', type: 'video', content: 't_7vX36ldyI' },
          { id: 'android-l4', title: 'Layouts, Modifiers, and State', type: 'text', content: 'Compose builds UIs by nesting composable functions. We will learn about core layout components like Column (arranges children vertically), Row (arranges children horizontally), and Box (stacks children on top of each other). Modifiers are used to decorate or add behavior to Composables, such as setting padding, size, background color, and click handlers. We will also dive into managing UI state using `remember` and `mutableStateOf` to make our UI dynamic and interactive.' },
        ],
      },
      {
        id: 'android-m3',
        title: 'App Architecture',
        lessons: [
            { id: 'android-l5', title: 'Activities & Navigation', type: 'video', content: 'j1_I3A1o2Ak' },
            { id: 'android-l6', title: 'MVVM with ViewModels', type: 'text', content: 'The Model-View-ViewModel (MVVM) architecture pattern separates UI logic from business logic, improving modularity and testability. ViewModels are used to store and manage UI-related data in a lifecycle-conscious way, meaning they survive configuration changes like screen rotations. We will learn how to use `ViewModel` and `LiveData` or `StateFlow` to expose data to the UI and handle user events. This approach leads to more robust and maintainable app code.'}
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
                { id: 'py-l2', title: 'Data Structures in Python', type: 'text', content: 'Python includes several powerful built-in data structures. \n- **Lists** are ordered, mutable collections (e.g., `my_list = [1, "hello", 3.14]`).\n- **Tuples** are ordered and immutable, often used for data that should not change (e.g., `my_tuple = (1, "hello", 3.14)`).\n- **Dictionaries** are unordered key-value pairs, perfect for storing related information (e.g., `my_dict = {"name": "John", "age": 30}`).\n- **Sets** are unordered collections of unique items, useful for membership testing and eliminating duplicates. Mastering these is essential for organizing and storing data efficiently in any Python program.'}
            ]
        },
        {
            id: 'py-m2',
            title: 'Control Flow and Functions',
            lessons: [
              { id: 'py-l3', title: 'Conditional Statements and Loops', type: 'video', content: 'OnurGvYYR1k' },
              { id: 'py-l4', title: 'Writing Your Own Functions', type: 'text', content: 'Functions are reusable blocks of code that perform a specific task, defined using the `def` keyword. They help to make your code more modular, organized, and easier to debug by breaking down complex problems into smaller, manageable pieces. We will cover how to define functions, pass arguments (including positional and keyword arguments), and return values. We will also touch on default parameter values and variable-scope.'}
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
                { id: 'cs-l2', title: 'Core Security Principles (CIA Triad)', type: 'text', content: 'The CIA Triad (Confidentiality, Integrity, Availability) is a foundational model for guiding information security policies. \n- **Confidentiality** ensures that sensitive information is not disclosed to unauthorized individuals, entities, or processes. (e.g., using encryption).\n- **Integrity** ensures the accuracy and completeness of data over its entire lifecycle (e.g., using hash functions to verify file integrity).\n- **Availability** ensures that data and services are accessible when needed by authorized users. (e.g., preventing Denial-of-Service attacks). Understanding this triad is crucial for identifying vulnerabilities and implementing effective security measures.'}
            ]
        },
        {
            id: 'cs-m2',
            title: 'Network & Web Security',
            lessons: [
              { id: 'cs-l3', title: 'Common Web Attacks', type: 'text', content: 'Web applications are common targets for attackers. \n- **Cross-Site Scripting (XSS)** involves injecting malicious scripts into trusted websites, which then execute on a victim\'s browser. \n- **SQL Injection (SQLi)** is an attack where malicious SQL code is inserted into a query to manipulate a database, potentially exposing sensitive data. \n- **Cross-Site Request Forgery (CSRF)** tricks a victim into submitting a malicious request. Understanding how these attacks work is the first step to preventing them through proper input validation, output encoding, and other defensive coding practices.' },
              { id: 'cs-l4', title: 'Firewalls and Intrusion Detection', type: 'text', content: 'Firewalls act as a barrier between a trusted internal network and an untrusted external network (like the internet), controlling incoming and outgoing traffic based on a set of security rules. Intrusion Detection Systems (IDS) monitor network or system activities for malicious activities or policy violations and produce reports to a management station. An Intrusion Prevention System (IPS) is an extension of an IDS that can also block the detected threat.'}
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
                { id: 'dcn-l2', title: 'The OSI Model Explained', type: 'text', content: 'The Open Systems Interconnection (OSI) model is a conceptual framework that standardizes the functions of a telecommunication or computing system into seven abstract layers.\n1. **Physical**: Transmits raw bits over a physical medium.\n2. **Data Link**: Organizes bits into frames and handles error detection.\n3. **Network**: Responsible for routing packets from source to destination across multiple networks.\n4. **Transport**: Provides reliable data transfer between end systems (e.g., TCP, UDP).\n5. **Session**: Manages sessions between applications.\n6. **Presentation**: Translates, encrypts, and compresses data.\n7. **Application**: Provides network services directly to the user\'s applications. \nThis model helps in understanding and troubleshooting network problems by providing a clear separation of functions.'}
            ]
        },
        {
            id: 'dcn-m2',
            title: 'The TCP/IP Protocol Suite',
            lessons: [
                { id: 'dcn-l3', title: 'Understanding TCP and UDP', type: 'video', content: 'u-qs8gEcmGE' },
                { id: 'dcn-l4', title: 'IP Addressing and Subnetting', type: 'text', content: 'An Internet Protocol (IP) address is a numerical label assigned to each device connected to a computer network. IPv4 addresses are 32 bits long. Subnetting is the practice of dividing a network into two or more smaller networks (subnets). This increases security by isolating networks and can improve network performance by reducing the size of the broadcast domain. We will learn how to calculate subnets and assign IP addresses effectively.'}
            ]
        }
    ]
  }
];
