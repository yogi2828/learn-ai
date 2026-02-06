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
          { id: 'android-l1', title: 'Introduction to Kotlin', type: 'text', content: 'Kotlin is a modern, cross-platform, statically typed, general-purpose programming language with type inference. It is designed to interoperate fully with Java, and the JVM version of Kotlin\'s standard library depends on the Java Class Library, but type inference allows its syntax to be more concise. \n\nKey features we will cover include:\n- **Variables**: `val` for immutable (read-only) variables and `var` for mutable (read-write) variables. You declare them like `val name: String = "John"`.\n- **Basic Data Types**: `Int`, `Double`, `String`, `Boolean`, and `Char`. Kotlin infers the type, so you can often write `val age = 30`.\n- **Null Safety**: Kotlin\'s type system is designed to eliminate the danger of null references, also known as the "billion-dollar mistake". Variables are non-nullable by default. If you need a variable to hold null, you must explicitly declare it as nullable using a `?`, like `var address: String? = null`. This forces you to handle the null case, preventing unexpected crashes.\n- **Control Flow**: We\'ll look at `if-else` as an expression, `when` statements (a more powerful version of Java\'s switch), and loops (`for`, `while`). For example, you can assign the result of an if statement to a variable: `val result = if (a > b) a else b`.' },
          { id: 'android-l2', title: 'Functions and Classes', type: 'text', content: 'In Kotlin, functions are declared with the `fun` keyword. We will explore how to define functions with parameters and return values. For example: `fun sum(a: Int, b: Int): Int { return a + b }`. Classes are blueprints for creating objects, declared with the `class` keyword. This lesson covers creating simple classes with properties and initializers: `class Customer(val name: String)`. We\'ll explore the difference between primary constructors (part of the class header) and secondary constructors (prefixed with `constructor`). We will also introduce data classes, which are a concise way to create classes that just hold data. By adding the `data` keyword, the compiler automatically generates `equals()`, `hashCode()`, `toString()`, `copy()`, and component functions.' },
        ],
      },
      {
        id: 'android-m2',
        title: 'Building User Interfaces',
        lessons: [
          { id: 'android-l3', title: 'Intro to Jetpack Compose', type: 'video', content: 'CiiS_9dGk2Y' },
          { id: 'android-l4', title: 'Layouts, Modifiers, and State', type: 'text', content: 'Compose builds UIs by nesting composable functions. We will learn about core layout components like `Column` (arranges children vertically), `Row` (arranges children horizontally), and `Box` (stacks children on top of each other, like a `FrameLayout`). Modifiers are used to decorate or add behavior to Composables. They are chained together to apply styling, such as `Modifier.padding(16.dp).fillMaxWidth()`. We will also dive into managing UI state using `remember` and `mutableStateOf`. State is any value that can change over time. When state changes, Compose automatically re-runs the relevant composables to update the UI. For example: `var count by remember { mutableStateOf(0) }`.' },
        ],
      },
      {
        id: 'android-m3',
        title: 'App Architecture',
        lessons: [
            { id: 'android-l5', title: 'Activities & Navigation', type: 'video', content: '4gfiBPAo_hA' },
            { id: 'android-l6', title: 'MVVM with ViewModels', type: 'text', content: 'The Model-View-ViewModel (MVVM) architecture pattern separates UI logic from business logic, improving modularity and testability. \n- **Model**: Represents the data and business logic of the application. \n- **View**: The UI layer (in Compose, this is your composable functions). It observes the ViewModel. \n- **ViewModel**: Acts as a bridge between the Model and the View. It holds UI-related data in a lifecycle-conscious way, meaning it survives configuration changes like screen rotations. We will learn how to use Android\'s `ViewModel` class and expose data to the UI using `StateFlow` or `LiveData` to handle user events and update the UI reactively. This approach leads to more robust and maintainable app code.'}
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
                { id: 'py-l2', title: 'Data Structures in Python', type: 'text', content: 'Python includes several powerful built-in data structures. \n- **Lists** are ordered, mutable collections that can store items of different types (e.g., `my_list = [1, "hello", 3.14]`). They support indexing and slicing. \n- **Tuples** are ordered and immutable, often used for data that should not change after creation. They are created with parentheses: `my_tuple = (1, "hello", 3.14)`. \n- **Dictionaries** are unordered collections of key-value pairs, perfect for storing related information. Keys must be unique and immutable. Example: `my_dict = {"name": "John", "age": 30}`. \n- **Sets** are unordered collections of unique items. They are useful for membership testing and eliminating duplicates efficiently. Example: `my_set = {1, 2, 3}`. Mastering these is essential for organizing and storing data efficiently in any Python program.'}
            ]
        },
        {
            id: 'py-m2',
            title: 'Control Flow and Functions',
            lessons: [
              { id: 'py-l3', title: 'Conditional Statements and Loops', type: 'video', content: 'PqFKC-2g1l4' },
              { id: 'py-l4', title: 'Writing Your Own Functions', type: 'text', content: 'Functions are reusable blocks of code that perform a specific task, defined using the `def` keyword. They help to make your code more modular, organized, and easier to debug by breaking down complex problems into smaller, manageable pieces. We will cover how to define functions, pass arguments (including positional and keyword arguments), and use the `return` statement to send a value back. We will also touch on default parameter values (e.g., `def greet(name="Guest")`) and the concept of variable scope (local vs. global variables).'}
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
                { id: 'cs-l1', title: 'The Threat Landscape', type: 'video', content: 'PlH7g1R-j5w' },
                { id: 'cs-l2', title: 'Core Security Principles (CIA Triad)', type: 'text', content: 'The CIA Triad (Confidentiality, Integrity, Availability) is a foundational model for guiding information security policies. \n- **Confidentiality** ensures that sensitive information is not disclosed to unauthorized individuals, entities, or processes. Common tools for this include encryption, access control lists (ACLs), and data classification. \n- **Integrity** ensures the accuracy and completeness of data over its entire lifecycle. This means data cannot be modified in an unauthorized or undetected manner. Hashing functions (like SHA-256) are a key tool to verify file integrity. \n- **Availability** ensures that data and services are accessible when needed by authorized users. This involves protecting against hardware failures, network outages, and Denial-of-Service (DoS) attacks. Redundancy, backups, and disaster recovery plans are critical for maintaining availability. Understanding this triad is crucial for identifying vulnerabilities and implementing effective security measures.'}
            ]
        },
        {
            id: 'cs-m2',
            title: 'Network & Web Security',
            lessons: [
              { id: 'cs-l3', title: 'Common Web Attacks', type: 'text', content: 'Web applications are common targets for attackers. \n- **Cross-Site Scripting (XSS)** involves injecting malicious scripts into trusted websites, which then execute on a victim\'s browser. This can be used to steal cookies or session tokens. \n- **SQL Injection (SQLi)** is an attack where malicious SQL code is inserted into a query to manipulate a database, potentially exposing sensitive data, modifying data, or executing administrative operations. \n- **Cross-Site Request Forgery (CSRF)** tricks a victim into submitting a malicious request they did not intend to. For example, forcing a logged-in user to transfer funds. Understanding how these attacks work is the first step to preventing them through proper input validation, output encoding, parameterized queries (prepared statements), and using anti-CSRF tokens.' },
              { id: 'cs-l4', title: 'Firewalls and Intrusion Detection', type: 'text', content: 'A Firewall acts as a barrier between a trusted internal network and an untrusted external network (like the internet). It works by analyzing data packets and determining whether they should be allowed through based on a pre-determined set of rules. An Intrusion Detection System (IDS) is a device or software application that monitors a network or systems for malicious activity or policy violations. Any detected activity is typically reported either to an administrator or collected centrally using a security information and event management (SIEM) system. An Intrusion Prevention System (IPS) is an extension of an IDS that can also actively block or prevent the detected threat.'}
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
                { id: 'dcn-l1', title: 'What is a Computer Network?', type: 'video', content: 'LANW3J9Ug5g' },
                { id: 'dcn-l2', title: 'The OSI Model Explained', type: 'text', content: 'The Open Systems Interconnection (OSI) model is a conceptual framework that standardizes the functions of a computing system into seven abstract layers. \n1. **Physical Layer**: Transmits raw bits over a physical medium (cables, radio waves). Deals with voltage levels, pin layouts, and cable specifications. \n2. **Data Link Layer**: Organizes bits into frames and handles error detection and correction from the physical layer. It contains two sub-layers: MAC (Media Access Control) and LLC (Logical Link Control). MAC addresses are used here. \n3. **Network Layer**: Responsible for logical addressing (IP addresses) and routing packets from source to destination across multiple networks. \n4. **Transport Layer**: Provides reliable data transfer between end systems. The two main protocols are TCP (Transmission Control Protocol), which is connection-oriented and reliable, and UDP (User Datagram Protocol), which is connectionless and faster but less reliable. \n5. **Session Layer**: Manages, establishes, and terminates sessions between applications. \n6. **Presentation Layer**: Translates, encrypts, and compresses data. It ensures data is in a usable format for the Application layer. \n7. **Application Layer**: Provides network services directly to the user\'s applications, such as HTTP, FTP, and SMTP. \nThis model helps in understanding and troubleshooting network problems by providing a clear separation of functions.'}
            ]
        },
        {
            id: 'dcn-m2',
            title: 'The TCP/IP Protocol Suite',
            lessons: [
                { id: 'dcn-l3', title: 'Understanding TCP and UDP', type: 'video', content: 'x-K4iZu0T-M' },
                { id: 'dcn-l4', title: 'IP Addressing and Subnetting', type: 'text', content: 'An Internet Protocol (IP) address is a numerical label assigned to each device connected to a computer network that uses the Internet Protocol for communication. IPv4 addresses are 32 bits long, often shown as four decimal numbers separated by dots (e.g., 192.168.1.1). Subnetting is the practice of dividing a network into two or more smaller networks (subnets). This is done by "borrowing" bits from the host portion of the IP address to create a subnet mask. This increases security by isolating networks, improves performance by reducing the size of the broadcast domain, and helps to more efficiently manage a limited number of IP addresses. We will learn how to calculate subnets and assign IP addresses effectively.'}
            ]
        }
    ]
  }
];

    