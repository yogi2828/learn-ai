import type { Course } from './types';

export const mockCourses: Course[] = [
  {
    id: 'dsa',
    title: 'Data Structures & Algorithms',
    description: 'Master the fundamentals of data structures and algorithms, a key for coding interviews.',
    teacher: 'Dr. Ananya Sharma',
    imageId: 'course-ds',
    modules: [
      {
        id: 'm1',
        title: 'Introduction to Data Structures',
        lessons: [
          { id: 'l1', title: 'What is a Data Structure?', type: 'video', content: '8h3m_3b3i_g' },
          { id: 'l2', title: 'Complexity Analysis & Big O', type: 'text', content: 'Big O notation is crucial for analyzing algorithm efficiency. It describes the limiting behavior of a function when the argument tends towards a particular value or infinity. It provides an upper bound on the growth rate of the function, which helps in comparing the efficiency of different algorithms.' },
          { id: 'l2b', title: 'Space and Time Complexity', type: 'video', content: 'V6_1i1z291g' },
        ],
      },
      {
        id: 'm2',
        title: 'Arrays and Strings',
        lessons: [
          { id: 'l3', title: 'Introduction to Arrays', type: 'video', content: 'BBpAmxU_NQo' },
          { id: 'l4', title: 'String Manipulations', type: 'text', content: 'Common string manipulation techniques include slicing, concatenation, and searching. Many programming languages provide built-in functions for these operations.' },
        ],
      },
      {
        id: 'm3',
        title: 'Linked Lists',
        lessons: [
            { id: 'l5', title: 'Singly Linked Lists', type: 'video', content: 'oA-pBOComfo'},
            { id: 'l6', title: 'Doubly Linked Lists', type: 'text', content: 'A doubly linked list is a linked data structure that consists of a set of sequentially linked records called nodes. Each node contains three fields: two link fields (references to the previous and to the next node in the sequence of nodes) and one data field.'}
        ]
      },
       {
        id: 'm4',
        title: 'Stacks & Queues',
        lessons: [
            { id: 'l7', title: 'Understanding Stacks', type: 'video', content: 'I37k4Z36-DE'},
            { id: 'l8', title: 'Understanding Queues', type: 'video', content: 'XuCbpwmdGy4'}
        ]
      },
      {
        id: 'm5',
        title: 'Trees & Graphs',
        lessons: [
            { id: 'l9', title: 'Introduction to Trees', type: 'text', content: 'A tree is a widely used abstract data type that represents a hierarchical structure with a set of connected nodes. '},
            { id: 'l10', title: 'Graph Traversal (BFS, DFS)', type: 'video', content: 'pcY1W3C5IuY'}
        ]
      },
      {
        id: 'm6',
        title: 'Advanced Topics',
        lessons: [
            { id: 'l11', title: 'Dynamic Programming', type: 'video', content: 'oBt53YbR9Kk' },
            { id: 'l12', title: 'Greedy Algorithms', type: 'text', content: 'A greedy algorithm is an algorithmic paradigm that follows the problem-solving heuristic of making the locally optimal choice at each stage with the hope of finding a global optimum.'}
        ]
      }
    ],
  },
  {
    id: 'web-development',
    title: 'Full Stack Web Development',
    description: 'Learn to build modern web applications from front to back with the MERN stack.',
    teacher: 'Rohan Kapoor',
    imageId: 'course-webdev',
    modules: [
        {
            id: 'wm1',
            title: 'Frontend with React',
            lessons: [
                { id: 'wl1', title: 'React Fundamentals', type: 'video', content: 'SqcY0GlETPk' },
                { id: 'wl2', title: 'State and Props', type: 'text', content: 'State and props are the core concepts of React. Props (short for properties) are used to pass data from a parent component to a child component. State is used for managing data that changes over time within a component.'},
                { id: 'wl2b', title: 'React Hooks Explained', type: 'video', content: 'TNhaISOUy6Q'}
            ]
        },
        {
            id: 'wm2',
            title: 'Backend with Node.js & Express',
            lessons: [
                { id: 'wl3', title: 'Building a REST API', type: 'video', content: 'pKd0Rpw7O48' },
                { id: 'wl4', title: 'Connecting to MongoDB', type: 'video', content: 'oT2C92I13yY' }
            ]
        },
        {
            id: 'wm3',
            title: 'Authentication',
            lessons: [
                { id: 'wl5', title: 'JWT Authentication', type: 'text', content: 'JSON Web Tokens (JWT) are an open, industry standard RFC 7519 method for representing claims securely between two parties.' },
                { id: 'wl6', title: 'OAuth with Passport.js', type: 'video', content: 'sytR3V5aTOk'}
            ]
        }
    ]
  },
  {
    id: 'machine-learning',
    title: 'Machine Learning Foundations',
    description: 'Dive into the world of Machine Learning and understand its core concepts and algorithms.',
    teacher: 'Saanvi Desai',
    imageId: 'course-ml',
    modules: [
        {
            id: 'mlm1',
            title: 'Introduction to ML',
            lessons: [
                { id: 'mll1', title: 'What is Machine Learning?', type: 'video', content: 'ukzFI9rgwfU' },
                { id: 'mll2', title: 'Supervised vs. Unsupervised Learning', type: 'text', content: 'Supervised learning involves learning from labeled data, where the algorithm learns to map input to output. Unsupervised learning deals with unlabeled data, where the algorithm tries to find patterns and structures on its own.'}
            ]
        },
        {
            id: 'mlm2',
            title: 'Regression and Classification',
            lessons: [
              { id: 'mll3', title: 'Linear Regression', type: 'video', content: 'zaxB0G_s5xQ'},
              { id: 'mll4', title: 'Logistic Regression', type: 'text', content: 'Logistic regression is a statistical model that in its basic form uses a logistic function to model a binary dependent variable, although many more complex extensions exist.'}
            ]
        },
        {
            id: 'mlm3',
            title: 'Neural Networks',
            lessons: [
                { id: 'mll5', title: 'Introduction to Neural Networks', type: 'video', content: 'aircAruvnKk'},
                { id: 'mll6', title: 'Deep Learning Explained', type: 'text', content: 'Deep learning is part of a broader family of machine learning methods based on artificial neural networks with representation learning.'}
            ]
        }
    ]
  },
  {
    id: 'dbms',
    title: 'Database Management Systems',
    description: 'Understand how databases work, from SQL queries to database design and normalization.',
    teacher: 'Vikram Singh',
    imageId: 'course-dbms',
    modules: [
        {
            id: 'dbm1',
            title: 'Introduction to Databases',
            lessons: [
                { id: 'dbl1', title: 'What is a DBMS?', type: 'video', content: '4cWkVbCgI-c' },
                { id: 'dbl2', title: 'Relational Model', type: 'text', content: 'The relational model for database management is a database model based on first-order predicate logic, first formulated and proposed in 1969 by Edgar F. Codd.'}
            ]
        },
        {
            id: 'dbm2',
            title: 'SQL Fundamentals',
            lessons: [
                { id: 'dbl3', title: 'Basic SELECT Queries', type: 'video', content: 'HXV3zeQKqGY' },
                { id: 'dbl4', title: 'JOINs and Subqueries', type: 'text', content: 'An SQL JOIN clause is used to combine rows from two or more tables, based on a related column between them.'}
            ]
        },
        {
            id: 'dbm3',
            title: 'Database Design',
            lessons: [
                { id: 'dbl5', title: 'Normalization (1NF, 2NF, 3NF)', type: 'video', content: 'GFHlW1b6i64' },
                { id: 'dbl6', title: 'Entity-Relationship Diagrams', type: 'text', content: 'An Entity-Relationship (ER) diagram is a type of flowchart that illustrates how “entities” such as people, objects, or concepts relate to each other within a system.'}
            ]
        }
    ]
  },
  {
    id: 'cpp-programming',
    title: 'C++ for Beginners',
    description: 'Learn the powerful C++ language from scratch. Covers basics to object-oriented programming.',
    teacher: 'Vikram Singh',
    imageId: 'course-cpp',
     modules: [
        {
            id: 'cppm1',
            title: 'C++ Basics',
            lessons: [
                { id: 'cppl1', title: 'Your First C++ Program', type: 'video', content: 'vLnPwxZdW4Y' },
                { id: 'cppl2', title: 'Variables and Data Types', type: 'text', content: 'In C++, variables are containers for storing data values. C++ has various data types like int, double, char, string, and bool to define the type of data a variable can hold.'}
            ]
        },
        {
            id: 'cppm2',
            title: 'Object-Oriented Programming',
            lessons: [
              { id: 'cppl3', title: 'Classes and Objects', type: 'video', content: '1jzoiI-23oE' },
              { id: 'cppl4', title: 'Inheritance & Polymorphism', type: 'text', content: 'Inheritance allows a class to inherit properties and methods from another class. Polymorphism allows methods to do different things based on the object it is acting upon.'}
            ]
        }
    ]
  },
  {
    id: 'python-data-science',
    title: 'Python for Data Science',
    description: 'Master Python and its libraries like NumPy, Pandas, and Matplotlib for data analysis.',
    teacher: 'Rohan Kapoor',
    imageId: 'course-python',
     modules: [
        {
            id: 'pydsm1',
            title: 'Python Fundamentals',
            lessons: [
                { id: 'pydsl1', title: 'Introduction to Python', type: 'video', content: 'kqtD5dpn9C8' },
                { id: 'pydsl2', title: 'Data Structures in Python', type: 'text', content: 'Python includes several built-in data structures, such as lists, tuples, dictionaries, and sets. These are essential for organizing and storing data efficiently.'}
            ]
        },
        {
            id: 'pydsm2',
            title: 'NumPy and Pandas',
            lessons: [
              { id: 'pydsl3', title: 'Data Analysis with Pandas', type: 'video', content: 'gtjxAH8uaP0' },
              { id: 'pydsl4', title: 'Numerical Computing with NumPy', type: 'text', content: 'NumPy is a library for the Python programming language, adding support for large, multi-dimensional arrays and matrices, along with a large collection of high-level mathematical functions to operate on these arrays.'}
            ]
        }
    ]
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity Essentials',
    description: 'Learn the fundamentals of cybersecurity, including threat analysis and network security.',
    teacher: 'Saanvi Desai',
    imageId: 'course-cyber',
     modules: [
        {
            id: 'csm1',
            title: 'Introduction to Cybersecurity',
            lessons: [
                { id: 'csl1', title: 'The Threat Landscape', type: 'video', content: 'mutLUly04wA' },
                { id: 'csl2', title: 'Core Security Principles (CIA Triad)', type: 'text', content: 'The CIA Triad (Confidentiality, Integrity, Availability) is a foundational model for guiding information security policies.'}
            ]
        },
        {
            id: 'csm2',
            title: 'Network & Web Security',
            lessons: [
              { id: 'csl3', title: 'Common Web Attacks (XSS, SQLi)', type: 'video', content: 'YEj5KV2m6eI' },
            ]
        }
    ]
  },
   {
    id: 'cloud-aws',
    title: 'Cloud Computing with AWS',
    description: 'An introduction to cloud computing concepts and services using Amazon Web Services.',
    teacher: 'Rohan Kapoor',
    imageId: 'course-cloud',
     modules: [
        {
            id: 'ccm1',
            title: 'Cloud Fundamentals',
            lessons: [
                { id: 'ccl1', title: 'What is Cloud Computing?', type: 'video', content: 'M5r9k2I22dE' },
                { id: 'ccl2', title: 'Introduction to AWS', type: 'text', content: 'Amazon Web Services (AWS) is a comprehensive, evolving cloud computing platform provided by Amazon that includes a mixture of infrastructure as a service (IaaS), platform as a service (PaaS) and packaged software as a service (SaaS) offerings.'}
            ]
        },
        {
            id: 'ccm2',
            title: 'Core AWS Services',
            lessons: [
              { id: 'ccl3', title: 'EC2, S3, and VPC', type: 'video', content: 'rYAdniT-GcE' },
            ]
        }
    ]
  }
];
