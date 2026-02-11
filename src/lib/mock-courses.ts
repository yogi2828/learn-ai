import type { Course } from './types';

export const mockCourses: Course[] = [
  {
    id: 'android',
    title: 'Android Programming',
    description: 'Learn to build native Android apps from scratch using Kotlin and Jetpack Compose.',
    teacher: 'Rohan Kapoor',
    imageId: 'course-android-1',
    modules: [
      {
        id: 'android-m1',
        title: 'Kotlin Fundamentals for Android',
        lessons: [
          { id: 'android-l1-1', title: 'Introduction to Kotlin', type: 'text', content: 'Kotlin is a modern, cross-platform, statically typed, general-purpose programming language with type inference, developed by JetBrains. It is designed to interoperate fully with Java, and the JVM version of Kotlin\'s standard library depends on the Java Class Library. Google announced it as the preferred language for Android app development in 2019. Its key advantages include conciseness (reducing boilerplate code), safety (eliminating null pointer exceptions with its inherent null safety), and interoperability (allowing seamless use of Java libraries).\n\nIn this lesson, we will set up the Android Studio environment for Kotlin development. We will explore how to create a new project and understand the basic structure of an Android application. We will write our first "Hello, World!" program in Kotlin and run it on an emulator or a physical device, observing how the Kotlin code compiles and executes within the Android runtime.' },
          { id: 'android-l1-2', title: 'Variables, Data Types, and Null Safety', type: 'text', content: 'Kotlin distinguishes between mutable (`var`) and immutable (`val`) variables. An immutable variable cannot be reassigned after its initial value is set, which promotes safer, more predictable code. Kotlin supports various data types, including numbers (`Int`, `Double`, `Float`), characters (`Char`), booleans (`Boolean`), and strings (`String`). Kotlin\'s type inference system often allows you to omit the explicit type declaration.\n\nA core feature of Kotlin is null safety. By default, types are non-nullable, meaning they cannot hold a `null` value. To allow nulls, you must explicitly mark a type as nullable by appending a `?` (e.g., `var name: String? = null`). This compile-time check forces developers to handle potential nulls using safe calls (`?.`), the Elvis operator (`?:`), or non-null asserted calls (`!!`), drastically reducing the occurrence of `NullPointerException` at runtime.' },
           { id: 'android-l1-3', title: 'Control Flow: Conditionals and Loops', type: 'text', content: 'Control flow statements direct the execution of a program. In Kotlin, `if-else` can be used as a statement or as an expression that returns a value. For example: `val max = if (a > b) a else b`. The `when` expression is a more powerful and flexible replacement for the traditional `switch` statement. It can be used with a wide range of types and conditions, making code more readable.\n\nFor iteration, Kotlin provides `for` and `while` loops. The `for` loop is commonly used to iterate over anything that provides an iterator, such as ranges (`for (i in 1..5)`), collections (`for (item in list)`), or strings. `while` and `do-while` loops execute a block of code as long as a specified condition is true. We will explore how these constructs are used to manage program flow and perform repetitive tasks in Android development.' },
        ],
      },
      {
        id: 'android-m2',
        title: 'Building User Interfaces with Jetpack Compose',
        lessons: [
          { id: 'android-l2-1', title: 'Introduction to Declarative UIs', type: 'text', content: "Jetpack Compose is Android's modern, declarative UI toolkit for building native user interfaces. It simplifies and accelerates UI development by shifting the paradigm from imperative (modifying a widget hierarchy) to declarative (describing the UI for a given state). Instead of using XML layouts, you define your UI by calling composable functions in Kotlin. A composable function is a regular function annotated with `@Composable` that describes a piece of your UI. When the underlying data that the UI depends on (the state) changes, Compose intelligently and automatically re-runs the necessary composable functions to update the UI. This process, called recomposition, is highly efficient as it only updates the components whose state has changed. This approach reduces boilerplate code, eliminates entire classes of bugs related to manual view updates, and promotes a more reactive and maintainable architecture." },
          { id: 'android-l2-2', title: 'Core Composables and Layouts', type: 'text', content: 'Jetpack Compose provides a set of fundamental building blocks for creating UIs. Basic composables include `Text` for displaying text, `Button` for user interactions, `Image` for displaying graphics, and `TextField` for user input. To arrange these composables, Compose offers standard layout components: `Column` arranges its children vertically, `Row` arranges them horizontally, and `Box` stacks its children on top of one another, allowing for complex layering and positioning. Understanding how to nest these layouts is key to building complex and responsive screens. We will explore how to use these core components to build a simple UI and structure it effectively.' },
          { id: 'android-l2-3', title: 'State Management in Compose', type: 'text', content: 'State in a Compose application is any value that can change over time and affect the UI. Compose follows a reactive model where the UI automatically updates when state changes. To make state observable by Compose, we use `mutableStateOf`. To ensure that this state is preserved across recompositions (re-draws of the UI), we must wrap it with `remember`. For example: `var count by remember { mutableStateOf(0) }`. When this `count` variable is updated, any composable that reads its value will be automatically recomposed. This principle of "state hoisting" involves lifting state to the nearest common ancestor of the composables that use it, making UI components more reusable and easier to test. We will practice managing simple and complex state within a Compose application.' },
        ],
      },
      {
        id: 'android-m3',
        title: 'Android App Architecture and Navigation',
        lessons: [
            { id: 'android-l3-1', title: 'Single-Activity Architecture', type: 'text', content: "Modern Android development has largely adopted a single-Activity architecture. In this model, an application has only one Activity, which acts as the main entry point and a container for the entire UI. This `MainActivity` is responsible for handling system interactions, managing the app's lifecycle, and hosting the Jetpack Compose UI. All other 'screens' within the app are implemented as composable functions. This approach simplifies the architecture by removing the complexities and lifecycle issues associated with managing multiple Activities or Fragments. It leads to a more predictable and streamlined development process, where the focus is on building a tree of composable functions rather than managing a stack of Activities." },
            { id: 'android-l3-2', title: 'Navigation with Compose Navigation', type: 'text', content: 'Navigation between different screens (composables) in a single-Activity app is managed by the Jetpack Navigation-Compose library. This library provides a `NavController` to orchestrate navigation actions and a `NavHost` composable, which serves as a container for your navigation graph. You define your app\'s screens as destinations within the `NavHost`. Navigation is triggered by calling methods on the `NavController`, such as `navigate("profile")`. The library supports passing arguments between destinations, deep linking, and managing the back stack, providing a type-safe and robust way to handle all navigation logic directly within your Kotlin code.'},
            { id: 'android-l3-3', title: 'Introduction to MVVM', type: 'text', content: 'The Model-View-ViewModel (MVVM) architecture pattern is the officially recommended architecture for Android apps. It promotes a separation of concerns, making the app more modular, testable, and maintainable. The layers are:\n- **Model**: Represents the data and business logic of the application. It is responsible for retrieving and managing data, whether from a remote server, a local database, or another source.\n- **View**: The UI layer of the application. In Jetpack Compose, this consists of your composable functions. The View\'s responsibility is to display the data provided by the ViewModel and to pass user events (like button clicks) to it.\n- **ViewModel**: Acts as a bridge between the Model and the View. The ViewModel fetches data from the Model, prepares it for display, and exposes it to the View. A key feature of the Android `ViewModel` class is that it is lifecycle-aware; it survives configuration changes (like screen rotation) that would otherwise destroy and recreate the UI, ensuring data persistence across these events.'}
        ]
      },
    ],
  },
  {
    id: 'python',
    title: 'Python for Everybody',
    description: 'Master the fundamentals of programming with Python 3 and build your first applications.',
    teacher: 'Saanvi Desai',
    imageId: 'course-python-1',
     modules: [
        {
            id: 'py-m1',
            title: 'Python Fundamentals',
            lessons: [
                { id: 'py-l1-1', title: 'Introduction to Python & Setup', type: 'text', content: "Python is a high-level, interpreted, general-purpose programming language known for its simple, clean syntax. Its design philosophy emphasizes code readability, making it an ideal language for beginners. We will start by installing Python and a code editor like Visual Studio Code. We'll write our first 'Hello, World!' program and learn how to execute Python scripts from the command line. This foundational step is crucial for understanding how Python code is run and for setting up a productive development environment." },
                { id: 'py-l1-2', title: 'Variables, Data Types, and Type Casting', type: 'text', content: 'Variables are used to store data. In Python, you don\'t need to declare the data type; it is inferred at runtime (dynamic typing). We will cover fundamental data types: `int` (integers), `float` (floating-point numbers), `str` (strings for text), and `bool` (booleans for True/False values). We will also learn about type casting, which is the process of converting a variable from one data type to another, for example, converting a string of numbers into an actual integer using `int()`.' },
                { id: 'py-l1-3', title: 'Basic Operators in Python', type: 'text', content: "Operators are special symbols that perform operations on values and variables. We'll explore:\n- **Arithmetic Operators**: `+` (addition), `-` (subtraction), `*` (multiplication), `/` (division), `%` (modulus), `**` (exponentiation), and `//` (floor division).\n- **Comparison Operators**: `==` (equal to), `!=` (not equal to), `>` (greater than), `<` (less than), `>=` (greater than or equal to), and `<=` (less than or equal to). These are used to compare values and result in a boolean.\n- **Logical Operators**: `and`, `or`, and `not`. These are used to combine conditional statements and control the flow of your program." },
                { id: 'py-l1-4', title: 'Working with Strings', type: 'text', content: "Strings are sequences of characters and are one of the most commonly used data types. This lesson covers creating strings, accessing characters via indexing, and extracting substrings using slicing. We'll also explore powerful string methods like `.upper()`, `.lower()`, `.strip()` (for removing whitespace), `.split()` (for breaking a string into a list), and `.join()` (for combining a list of strings). Finally, we'll learn about different ways to format strings, including f-strings (formatted string literals), which provide a concise and convenient way to embed expressions inside string literals for formatting." },
            ]
        },
        {
            id: 'py-m2',
            title: 'Core Data Structures',
            lessons: [
              { id: 'py-l2-1', title: 'Lists - Mutable Sequences', type: 'text', content: 'Lists are ordered, mutable (changeable) collections of items, and they are one of Python\'s most versatile data structures. You can create a list by placing comma-separated values inside square brackets `[]`. Lists can contain items of different data types. We will cover accessing items by index, modifying items, adding items using `.append()` and `.insert()`, and removing items using `.remove()` and `del`. We will also explore list slicing, list comprehensions for creating concise lists, and useful methods like `.sort()` and `.reverse()`.' },
              { id: 'py-l2-2', title: 'Tuples - Immutable Sequences', type: 'text', content: 'Tuples are similar to lists in that they are ordered collections of items. However, the key difference is that tuples are immutable, meaning their contents cannot be changed after creation. They are created using parentheses `()`. Their immutability makes them useful for representing fixed collections of data, such as coordinates (x, y) or RGB color values. Because they are immutable, they can also be used as keys in dictionaries, whereas lists cannot. We will discuss tuple creation, indexing, and when to choose a tuple over a list.' },
              { id: 'py-l2-3', title: 'Dictionaries - Key-Value Pairs', type: 'text', content: 'Dictionaries are unordered collections of data stored as key-value pairs. They are created with curly braces `{}` and are optimized for retrieving values when the key is known. Keys must be unique and immutable (e.g., strings, numbers, or tuples). This lesson will cover creating dictionaries, accessing values using their keys, adding new key-value pairs, modifying existing ones, and removing pairs. We will also learn how to iterate through keys, values, and items using `.keys()`, `.values()`, and `.items()`.' },
              { id: 'py-l2-4', title: 'Sets - Unordered and Unique', type: 'text', content: 'Sets are unordered collections of unique items. They are useful for tasks like checking for membership, removing duplicates from a sequence, and performing mathematical set operations like union (`|`), intersection (`&`), difference (`-`), and symmetric difference (`^`). Sets are created with curly braces `{}` or the `set()` function. We will explore how and when to use sets to simplify code and improve efficiency for certain problems.' },
            ]
        },
        {
            id: 'py-m3',
            title: 'Control Flow and Functions',
            lessons: [
              { id: 'py-l3-1', title: 'Conditional Logic', type: 'text', content: "Conditional statements allow your program to make decisions. The fundamental constructs are `if`, `elif` (else if), and `else`. An `if` statement executes a block of code if its condition is true. `elif` allows you to check multiple alternative conditions, and `else` provides a block of code to execute if none of the preceding conditions are true. We will practice writing complex conditions using logical operators to create robust decision-making logic in our programs." },
              { id: 'py-l3-2', title: 'Loops for Iteration', type: 'text', content: 'Loops are used to execute a block of code repeatedly. The `for` loop is used for iterating over a sequence (like a list, tuple, or string). The `while` loop repeats as long as a certain boolean condition is met. We will also cover loop control statements like `break` (to exit a loop prematurely) and `continue` (to skip the current iteration and move to the next), and the `else` clause which can be used with loops.' },
              { id: 'py-l3-3', title: 'Writing Reusable Functions', type: 'text', content: 'Functions are reusable blocks of code that perform a specific task, defined using the `def` keyword. They help make your code more modular, organized, and easier to debug. This lesson covers how to define functions, pass arguments (parameters), and use the `return` statement to send a value back. We will also explore default parameter values, keyword arguments (passing arguments by name), and functions with a variable number of arguments using `*args` and `**kwargs`.' },
            ]
        },
         {
            id: 'py-m4',
            title: 'Object-Oriented Programming (OOP)',
            lessons: [
              { id: 'py-l4-1', title: 'Classes and Objects', type: 'text', content: 'Object-Oriented Programming is a paradigm based on the concept of "objects", which can contain data (attributes) and code (methods). A class is a blueprint for creating objects. For example, you could have a `Dog` class that defines the properties (like name, breed) and behaviors (like bark, wag_tail) that all dog objects will have. An object is an instance of a class.' },
              { id: 'py-l4-2', title: 'Inheritance and Polymorphism', type: 'text', content: "Inheritance allows us to define a class that inherits all the methods and properties from another class. The parent class is the class being inherited from, and the child class is the class that inherits. This promotes code reuse. Polymorphism allows us to use a single interface to represent different underlying forms (data types). For example, you might have a `speak()` method in both a `Dog` class and a `Cat` class, and each will implement it differently ('Woof' vs 'Meow')." },
            ]
        }
    ]
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity Essentials',
    description: 'Learn the fundamentals of cybersecurity, including threat analysis and network security.',
    teacher: 'Dr. Ananya Sharma',
    imageId: 'course-cyber-1',
     modules: [
        {
            id: 'cs-m1',
            title: 'Foundations of Cybersecurity',
            lessons: [
                { id: 'cs-l1-1', title: 'The Threat Landscape', type: 'text', content: "The modern digital threat landscape is a complex and constantly evolving ecosystem of adversaries, attack vectors, and vulnerabilities. Adversaries range from individual hobbyist hackers to organized cybercrime syndicates and state-sponsored groups. Their methods include technical exploits like malware (viruses, ransomware, spyware), phishing attacks designed to steal credentials through social engineering, and denial-of-service (DoS) attacks. Understanding this landscape is the first step toward building an effective defense." },
                { id: 'cs-l1-2', title: 'The CIA Triad', type: 'text', content: 'The CIA Triad (Confidentiality, Integrity, Availability) is a foundational model for guiding information security policies.\n- **Confidentiality**: Ensures that sensitive information is not disclosed to unauthorized individuals. Tools include encryption and access control.\n- **Integrity**: Maintains the accuracy and completeness of data. Hashing functions are a key tool to verify file integrity.\n- **Availability**: Ensures that data and services are accessible when needed by authorized users. This involves protecting against hardware failures and DoS attacks.'},
                { id: 'cs-l1-3', title: 'Risk Management', type: 'text', content: "Cybersecurity risk management is the process of identifying, assessing, and controlling threats to an organization's capital and earnings. This involves identifying potential threats and vulnerabilities, determining their likelihood and potential impact, and then deciding on the best course of action. Actions can include mitigating the risk (implementing controls), transferring the risk (e.g., through insurance), accepting the risk, or avoiding the risk altogether. A risk assessment matrix is a common tool used to prioritize risks." }
            ]
        },
        {
            id: 'cs-m2',
            title: 'Network and Application Security',
            lessons: [
              { id: 'cs-l2-1', title: 'Common Web Application Attacks', type: 'text', content: 'Web applications are frequent targets. Common attacks include:\n- **Cross-Site Scripting (XSS)**: Injecting malicious scripts into trusted websites.\n- **SQL Injection (SQLi)**: Inserting malicious SQL code into a query to manipulate a database.\n- **Cross-Site Request Forgery (CSRF)**: Tricking a victim into submitting a malicious request they did not intend to. Defenses include input validation, parameterized queries, and anti-CSRF tokens.' },
              { id: 'cs-l2-2', title: 'Network Security Tools', type: 'text', content: 'Several tools are essential for securing a network.\n- **Firewalls**: Act as a barrier between a trusted internal network and an untrusted external network, filtering traffic based on a set of rules.\n- **Intrusion Detection Systems (IDS)**: Monitor a network or systems for malicious activity or policy violations and report it.\n- **Intrusion Prevention Systems (IPS)**: An extension of an IDS that can also actively block or prevent the detected threat. Together, these form a layered defense against network intrusions.'},
              { id: 'cs-l2-3', title: 'Secure Software Development Lifecycle (SSDLC)', type: 'text', content: 'The SSDLC integrates security practices into every phase of the software development lifecycle, from requirements gathering to deployment and maintenance. This "shift-left" approach aims to build security in from the start, rather than trying to add it on at the end. Key practices include threat modeling during the design phase, static and dynamic code analysis during development, penetration testing before release, and ongoing monitoring and patching after deployment. Building secure software is more effective and less costly than fixing vulnerabilities in production.' }
            ]
        },
        {
            id: 'cs-m3',
            title: 'Cryptography and Access Control',
            lessons: [
                { id: 'cs-l3-1', title: 'Fundamentals of Cryptography', type: 'text', content: 'Cryptography is the practice and study of techniques for secure communication in the presence of third parties. Core concepts include:\n- **Encryption**: The process of converting plaintext into ciphertext.\n- **Symmetric Encryption**: Uses the same key for both encryption and decryption (e.g., AES).\n- **Asymmetric Encryption (Public-Key Cryptography)**: Uses a pair of keys, a public key for encryption and a private key for decryption (e.g., RSA).\n- **Hashing**: A one-way function that converts an input into a fixed-size string of bytes (e.g., SHA-256). Used to verify data integrity.' },
                { id: 'cs-l3-2', title: 'Authentication, Authorization, and Accounting (AAA)', type: 'text', content: 'AAA provides the primary framework for controlling access to computer resources.\n- **Authentication**: The process of verifying the identity of a user (e.g., with a password, biometric scan, or security token). This is about proving you are who you say you are.\n- **Authorization**: The process of granting or denying a user specific permissions to resources after they have been authenticated. This determines what you are allowed to do.\n- **Accounting**: The process of tracking user activity and resource consumption. This is used for auditing, billing, and security analysis.' },
            ]
        },
    ]
  },
  {
    id: 'dcn',
    title: 'Data Communication and Networking',
    description: 'Understand how data travels across networks, from physical links to application protocols.',
    teacher: 'Vikram Singh',
    imageId: 'course-dcn-1',
    modules: [
        {
            id: 'dcn-m1',
            title: 'Foundations of Networking',
            lessons: [
                { id: 'dcn-l1-1', title: 'What is a Computer Network?', type: 'text', content: "A computer network is a collection of interconnected computing devices that can exchange data and share resources. These devices (nodes) can include computers, servers, smartphones, and printers. The connections are established through a communication medium, which can be wired (Ethernet cables) or wireless (Wi-Fi). The fundamental purpose of a network is to facilitate communication. Networks are categorized by scale: a Local Area Network (LAN) covers a small area like a home or office, while a Wide Area Network (WAN) connects LANs over large distances. The Internet is the largest WAN." },
                { id: 'dcn-l1-2', title: 'The OSI Model', type: 'text', content: 'The Open Systems Interconnection (OSI) model is a conceptual framework that standardizes network functions into seven layers:\n1. **Physical**: Transmits raw bits over a medium.\n2. **Data Link**: Organizes bits into frames and handles error detection. MAC addresses are used here.\n3. **Network**: Responsible for logical addressing (IP addresses) and routing packets across networks.\n4. **Transport**: Provides reliable data transfer (e.g., TCP) or fast, low-overhead transfer (e.g., UDP).\n5. **Session**: Manages sessions between applications.\n6. **Presentation**: Translates, encrypts, and compresses data.\n7. **Application**: Provides network services directly to user applications (e.g., HTTP, FTP, SMTP).' },
                { id: 'dcn-l1-3', title: 'The TCP/IP Model', type: 'text', content: 'The TCP/IP model is a more practical, four-layer model that is the foundation of the modern internet. Its layers are:\n1. **Network Access Layer (or Link Layer)**: Combines the OSI Physical and Data Link layers. It handles all the hardware details of physical interfacing.\n2. **Internet Layer**: Corresponds to the OSI Network Layer. It is responsible for logical addressing, routing, and packet delivery using the Internet Protocol (IP).\n3. **Transport Layer**: Corresponds to the OSI Transport Layer. It provides data flow between hosts, using either TCP (for reliability) or UDP (for speed).\n4. **Application Layer**: Combines the OSI Session, Presentation, and Application layers. It contains the protocols that user applications interact with, such as HTTP, SMTP, and FTP.' },
            ]
        },
        {
            id: 'dcn-m2',
            title: 'Transport and Network Layers',
            lessons: [
                { id: 'dcn-l2-1', title: 'TCP vs. UDP', type: 'text', content: "The Transport Layer has two primary protocols:\n- **Transmission Control Protocol (TCP)**: A connection-oriented protocol that provides reliable, ordered, and error-checked delivery of a stream of bytes. It establishes a connection via a three-way handshake before sending data. It's used for applications where data integrity is crucial, like web browsing (HTTP) and email (SMTP).\n- **User Datagram Protocol (UDP)**: A connectionless protocol that is simple and fast. It sends packets (datagrams) without establishing a connection or guaranteeing delivery. It's used for real-time applications where speed is more important than reliability, like video streaming and online gaming." },
                { id: 'dcn-l2-2', title: 'IP Addressing and Subnetting', type: 'text', content: 'An Internet Protocol (IP) address is a numerical label assigned to each device on a network. IPv4 addresses are 32 bits long, often shown as four decimal numbers (e.g., 192.168.1.1). Subnetting is the practice of dividing a network into smaller networks (subnets). This is done by using a subnet mask to "borrow" bits from the host portion of the IP address. Subnetting improves security, enhances performance by reducing broadcast traffic, and allows for more efficient management of a limited IP address space.' },
                { id: 'dcn-l2-3', title: 'Routing Protocols', type: 'text', content: 'Routing is the process of selecting a path for traffic in a network. Routers use routing protocols to share information with each other and build routing tables that determine the best path for data packets. There are two main categories:\n- **Interior Gateway Protocols (IGP)**: Used for routing within a single autonomous system (a network managed by one entity). Examples include RIP (Routing Information Protocol) and OSPF (Open Shortest Path First).\n- **Exterior Gateway Protocols (EGP)**: Used for routing between different autonomous systems. The primary EGP used on the internet is BGP (Border Gateway Protocol).' },
            ]
        },
         {
            id: 'dcn-m3',
            title: 'Application Layer Protocols',
            lessons: [
                { id: 'dcn-l3-1', title: 'HTTP and HTTPS', type: 'text', content: 'The Hypertext Transfer Protocol (HTTP) is the foundation of data communication for the World Wide Web. It is a request-response protocol where a client (like a web browser) sends a request to a server, which then returns a response. HTTPS (HTTP Secure) is the secure version of HTTP. It encrypts the communication between the client and server using Transport Layer Security (TLS), ensuring confidentiality and integrity of the data exchanged. This is essential for secure transactions like online banking and e-commerce.' },
                { id: 'dcn-l3-2', title: 'DNS - The Domain Name System', type: 'text', content: 'The Domain Name System (DNS) is the internet\'s phonebook. It translates human-readable domain names (like www.google.com) into machine-readable IP addresses (like 172.217.168.196). When you type a URL into your browser, your computer queries a series of DNS servers to find the corresponding IP address. This hierarchical and distributed naming system is a critical component of the internet, making it possible for users to navigate the web without needing to memorize IP addresses.' },
                { id: 'dcn-l3-3', title: 'Email Protocols: SMTP, POP3, IMAP', type: 'text', content: 'Several protocols work together to send and receive email.\n- **SMTP (Simple Mail Transfer Protocol)**: Used for sending emails from an email client to an email server, and for transferring emails between servers.\n- **POP3 (Post Office Protocol version 3)**: Used to retrieve emails from a server. It typically downloads the emails to the client and then deletes them from the server.\n- **IMAP (Internet Message Access Protocol)**: Also used to retrieve emails, but it allows the user to view and manage emails directly on the server. Changes made on one client (like reading or deleting an email) are synchronized across all clients, as the emails remain on the server.' },
            ]
        }
    ]
  }
];
