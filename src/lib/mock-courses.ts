
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
        title: 'Module 1: Kotlin Fundamentals for Android',
        lessons: [
          { 
            id: 'android-l1-1', 
            title: 'Introduction to Kotlin & Android Studio', 
            type: 'text', 
            content: `
Welcome to the world of Android development with Kotlin! Kotlin is a modern, cross-platform, statically typed, general-purpose programming language with type inference. Developed by JetBrains, it is designed to interoperate fully with Java, which was the original language for Android development. In 2019, Google officially announced Kotlin as the preferred language for building Android apps, thanks to its numerous advantages.

**Key Advantages of Kotlin:**
- **Conciseness:** Kotlin significantly reduces the amount of boilerplate code you need to write. This means you can express ideas with less code, which leads to fewer bugs and easier maintenance. For example, data classes in Kotlin automatically generate getters, setters, \`equals()\`, \`hashCode()\`, and \`toString()\` methods.
- **Null Safety:** One of Kotlin's most celebrated features is its built-in null safety. The type system distinguishes between nullable and non-nullable references, forcing developers to handle potential null values at compile time. This simple yet powerful feature eliminates the dreaded \`NullPointerException\`—one of the most common causes of crashes in Java applications.
- **Interoperability:** Kotlin is 100% interoperable with Java. This means you can have both Kotlin and Java code in the same project. You can call Java code from Kotlin and Kotlin code from Java seamlessly. This allows developers to gradually migrate existing Android apps from Java to Kotlin and continue using the vast ecosystem of Java libraries.
- **Structured Concurrency:** Kotlin Coroutines provide a powerful and simplified way to manage asynchronous operations and background tasks, which are essential in mobile development for maintaining a responsive user interface.

**Setting Up Your Development Environment:**
To begin, you will need **Android Studio**, the official Integrated Development Environment (IDE) for Android app development. 
1.  **Download and Install:** Get the latest version of Android Studio from the official Android developer website.
2.  **Android SDK:** The installation includes the Android SDK (Software Development Kit), which provides the tools and APIs necessary to develop apps. Use the SDK Manager within Android Studio to install different Android API levels.
3.  **Creating Your First Project:** We will walk through the process of creating a new project in Android Studio, selecting the "Empty Activity" template, and configuring it to use Kotlin. You will learn about the key files and directories in an Android project, including the Manifest file (\`AndroidManifest.xml\`), Gradle build scripts (\`build.gradle.kts\`), and resource folders (\`res\`).
4.  **Running Your App:** Finally, we will write our first "Hello, World!" program and run it on a virtual device using the Android Emulator or a physical Android device connected to your computer. This will give you a hands-on understanding of the build and run process.
` 
          },
          { 
            id: 'android-l1-2', 
            title: 'Variables, Data Types, and Control Flow', 
            type: 'text', 
            content: `
In Kotlin, understanding how to manage data and control the flow of your program is fundamental.

**Variables: \`val\` vs. \`var\`**
Kotlin has two keywords for declaring variables:
- **\`val\` (Value):** Used for immutable variables. Once a value is assigned to a \`val\`, it cannot be changed. This is similar to the \`final\` keyword in Java. It is best practice to use \`val\` whenever possible to promote immutability and make your code safer and more predictable.
  \`\`\`kotlin
  val name: String = "Android" 
  // name = "iOS" // This would cause a compile error
  \`\`\`
- **\`var\` (Variable):** Used for mutable variables. The value of a \`var\` can be reassigned after its initial declaration.
  \`\`\`kotlin
  var score: Int = 0
  score = 10 // This is allowed
  \`\`\`
Kotlin also has excellent type inference, meaning you can often omit the data type if the compiler can figure it out from the assigned value: \`val language = "Kotlin"\`.

**Basic Data Types:**
- **Numbers:** Kotlin has types for integers (\`Int\`, \`Long\`, \`Short\`, \`Byte\`) and floating-point numbers (\`Double\`, \`Float\`).
- **Characters:** The \`Char\` type is used for single characters, enclosed in single quotes (e.g., \`'A'\`).
- **Booleans:** The \`Boolean\` type represents logical values and can be either \`true\` or \`false\`.
- **Strings:** The \`String\` type is for sequences of characters. Kotlin strings support template expressions, allowing you to embed variables directly: \`val greeting = "Hello, $name"\`.

**Control Flow Statements:**
Control flow statements direct the execution path of your program.
- **\`if-else\` Expressions:** In Kotlin, \`if-else\` is an expression, meaning it returns a value. This makes it very powerful.
  \`\`\`kotlin
  val max = if (a > b) a else b
  \`\`\`
- **\`when\` Expressions:** The \`when\` expression is a more advanced and flexible replacement for the traditional \`switch\` statement. It can be used with a wide range of types and conditions, making your code more readable.
  \`\`\`kotlin
  when (x) {
      1 -> print("x is 1")
      2, 3 -> print("x is 2 or 3")
      in 4..10 -> print("x is between 4 and 10")
      else -> print("x is something else")
  }
  \`\`\`
- **Loops:** Kotlin provides \`for\` and \`while\` loops for iteration. The \`for\` loop is used to iterate over anything that provides an iterator, such as ranges (\`for (i in 1..5)\`) or collections (\`for (item in list)\`). \`while\` and \`do-while\` loops continue as long as a condition is true.
` 
          },
          { 
            id: 'android-l1-3', 
            title: 'Functions and Null Safety in Kotlin', 
            type: 'text', 
            content: `
Functions are the building blocks of any Kotlin program, and understanding null safety is crucial for writing robust Android applications.

**Defining Functions:**
Functions are declared using the \`fun\` keyword. They can take parameters and return a value.
\`\`\`kotlin
fun greet(name: String): String {
    return "Hello, $name"
}
\`\`\`
Kotlin also supports single-expression functions, which are more concise:
\`\`\`kotlin
fun add(a: Int, b: Int) = a + b
\`\`\`
Functions can have default arguments, which reduces the need for function overloading:
\`\`\`kotlin
fun showMessage(message: String, isError: Boolean = false) { /* ... */ }
// You can call it as:
showMessage("Success") // isError defaults to false
showMessage("Failure", true)
\`\`\`

**Understanding Null Safety:**
Kotlin's type system is designed to eliminate the risk of \`NullPointerException\` from your code. By default, variables cannot hold \`null\` values.

- **Non-Nullable Types:** A variable declared as \`String\` cannot be null. The compiler will enforce this rule.
  \`\`\`kotlin
  var name: String = "Kotlin"
  // name = null // Compile error
  \`\`\`
- **Nullable Types:** To allow a variable to hold null, you must explicitly declare it as nullable by appending a \`?\` to the type.
  \`\`\`kotlin
  var middleName: String? = "J."
  middleName = null // This is allowed
  \`\`\`

**Working with Nullable Types:**
When you have a nullable type, Kotlin forces you to handle the possibility of it being null before you can use it.
- **Safe Call Operator (\`?.\`):** This is the most common way to handle nulls. It executes the call only if the value is not null; otherwise, it returns null.
  \`\`\`kotlin
  val length = middleName?.length // length will be Int? (nullable Int)
  \`\`\`
- **The Elvis Operator (\`?:\`):** This operator is used to provide a default value when a nullable reference is null.
  \`\`\`kotlin
  val nameLength = middleName?.length ?: 0 // Returns length or 0 if middleName is null
  \`\`\`
- **Non-Null Asserted Call (\`!!\`):** This operator converts any value to a non-null type and throws a \`NullPointerException\` if the value is null. It should be used with caution and only when you are 100% sure the value is not null.
` 
          },
        ],
      },
      {
        id: 'android-m2',
        title: 'Module 2: Building User Interfaces with Jetpack Compose',
        lessons: [
          { 
            id: 'android-l2-1', 
            title: 'Introduction to Declarative UIs', 
            type: 'text', 
            content: `
Jetpack Compose is Android's modern, declarative UI toolkit for building native user interfaces. It represents a fundamental shift from the traditional imperative (XML-based) approach.

**Imperative vs. Declarative UI:**
- **Imperative (Old Way):** You manually create a layout of UI widgets (e.g., in XML) and then, in your code, you find these widgets (e.g., using \`findViewById\`) and tell them how to change in response to events. You are responsible for managing the state of the UI and ensuring it is always in sync with your application's data. This can be complex and error-prone.
- **Declarative (Compose Way):** You describe what your UI *should* look like for a given state. You don't tell the UI how to transition between states. Instead, when the application's state changes, the Compose framework intelligently and efficiently re-renders the parts of the UI that are affected by that change.

**Core Principles of Jetpack Compose:**
- **Composable Functions:** UIs in Compose are built by writing **composable functions**. These are regular Kotlin functions annotated with \`@Composable\`. Each function describes a piece of your UI, and you build your complete UI by combining these smaller, reusable functions.
- **Recomposition:** When the state that a composable function depends on changes, Compose automatically re-invokes that function to update the UI. This process is called **recomposition**. Compose is smart enough to only recompose the functions whose state has actually changed, making it very efficient.
- **Unidirectional Data Flow (UDF):** Compose encourages a UDF pattern where state flows down from a higher-level "source of truth" to the UI components that display it, and events (like button clicks) flow up from the UI to be handled by the state source. This makes the data flow predictable and easier to debug.

By adopting this declarative model, Compose dramatically simplifies and accelerates UI development, reduces boilerplate code, and helps you build more robust and maintainable apps.
` 
          },
          { 
            id: 'android-l2-2', 
            title: 'Core Composables and Layouts', 
            type: 'text', 
            content: `
Jetpack Compose provides a rich set of fundamental building blocks, called composables, for creating user interfaces.

**Basic Composables:**
These are the most common elements you will use to build your UI.
- **\`Text\`:** The primary composable for displaying text. It can be styled with properties like \`color\`, \`fontSize\`, \`fontWeight\`, and \`textAlign\`.
- **\`Button\` / \`OutlinedButton\` / \`TextButton\`:** Used for user interactions. They have an \`onClick\` lambda where you define the action to be performed.
- **\`Image\`:** For displaying graphical assets, either from your project's resources or from a URL (using a companion library like Coil or Glide).
- **\`TextField\` / \`OutlinedTextField\`:** Allow users to input text. You manage their state using a \`mutableStateOf\` variable.
- **\`Icon\`:** Displays a vector icon from the Material Design icon set.

**Standard Layout Composables:**
To arrange these basic composables on the screen, Compose offers three main layout components:
- **\`Column\`:** Arranges its children in a vertical sequence. You can configure its vertical arrangement (e.g., \`Arrangement.Top\`, \`Arrangement.Center\`, \`Arrangement.SpaceBetween\`) and horizontal alignment (e.g., \`Alignment.Start\`, \`Alignment.CenterHorizontally\`).
- **\`Row\`:** Arranges its children in a horizontal sequence. It has similar parameters for horizontal arrangement and vertical alignment.
- **\`Box\`:** Stacks its children on top of one another. It's useful for overlapping elements or for positioning a child within a parent using alignment modifiers (e.g., \`Alignment.Center\`, \`Alignment.TopEnd\`).

**Modifiers:**
Modifiers (\`Modifier\`) are essential for styling and configuring composables. They allow you to change a composable's size, layout, appearance, and behavior. You can chain modifiers together to apply multiple transformations.
Common modifiers include:
- \`.padding()\`: Adds space around the composable.
- \`.fillMaxWidth()\` / \`.fillMaxSize()\`: Makes the composable fill the available space.
- \`.background()\`: Sets the background color.
- \`.clickable()\`: Makes a non-interactive composable like \`Text\` or \`Box\` respond to clicks.

Understanding how to combine these core composables and apply modifiers is the key to building any UI in Jetpack Compose.
` 
          },
          { 
            id: 'android-l2-3', 
            title: 'State Management in Compose', 
            type: 'text', 
            content: `
State is at the heart of any interactive application. In Jetpack Compose, "state" is any value that can change over time and, as a result, affect the UI.

**Remembering State:**
A fundamental challenge in declarative UI is preserving state across recompositions. When a composable is re-invoked, all its local variables are reset. To tell Compose to preserve a value across these re-invocations, you must use the \`remember\` composable.

**Observable State with \`mutableStateOf\`:**
For Compose to know *when* to trigger a recomposition, the state must be observable. The most common way to create observable state is by using \`mutableStateOf\`. This function returns a special type that holds your value and notifies Compose whenever that value changes.

Combining these two concepts gives us the standard pattern for state in Compose:
\`\`\`kotlin
var count by remember { mutableStateOf(0) }
\`\`\`
Here:
- \`mutableStateOf(0)\` creates an observable state object holding the initial value \`0\`.
- \`remember { ... }\` ensures that this state object is not re-created every time the composable recomposes.
- The \`by\` keyword is a property delegate that lets you read and write the \`count\` variable directly, as if it were a normal \`Int\`, while automatically triggering recomposition on writes.

**State Hoisting:**
State hoisting is a critical pattern in Compose for creating reusable and testable components. The idea is to move state "up" from the composables that use it to a common ancestor.
A composable that holds its own state is called **stateful**. A composable that does not hold its own state is **stateless**. Stateless composables receive their state from their parent and communicate events up via lambdas (e.g., \`onClick: () -> Unit\`).

**Example of State Hoisting:**
\`\`\`kotlin
// Stateful parent composable
@Composable
fun CounterScreen() {
    var count by remember { mutableStateOf(0) }
    StatelessCounter(
        count = count,
        onIncrement = { count++ }
    )
}

// Stateless, reusable, and easily testable composable
@Composable
fun StatelessCounter(count: Int, onIncrement: () -> Unit) {
    Button(onClick = onIncrement) {
        Text("You have clicked the button $count times")
    }
}
\`\`\`
By making components stateless, you decouple them from how their state is stored and managed, making your UI architecture cleaner and more scalable.
` 
          },
        ],
      },
      {
        id: 'android-m3',
        title: 'Module 3: Android App Architecture and Navigation',
        lessons: [
            { 
              id: 'android-l3-1', 
              title: 'Single-Activity Architecture', 
              type: 'text', 
              content: `
Modern Android development has largely converged on a **single-Activity architecture**. This approach simplifies the app's structure and lifecycle management significantly compared to older, multi-Activity or Fragment-heavy architectures.

**The Concept:**
In this model, your entire application consists of just one Activity, typically named \`MainActivity\`. This Activity serves as the main entry point for your app and acts as a container for your entire UI, which is built using Jetpack Compose. All the different "screens" or pages within your app are not separate Activities or Fragments, but are instead different **composable functions**.

**Why a Single Activity?**
- **Simplified Lifecycle:** Managing the lifecycle of a single Activity is far simpler than juggling multiple Activities or dealing with the complex lifecycle of Fragments. You have one predictable entry point and one component to handle system events like configuration changes (e.g., screen rotation).
- **Consistent Context:** You have a single, consistent \`Context\` throughout your application, which simplifies tasks like accessing resources or system services.
- **Streamlined Navigation:** Navigation is handled entirely within the Compose world using the Navigation-Compose library. This provides a unified, type-safe, and programmatic way to move between screens, eliminating the need for \`Intents\` and Fragment transactions.
- **Shared State:** It becomes easier to share state between different screens using a shared \`ViewModel\`, as all composables live within the scope of the single Activity.

In this architecture, the \`MainActivity\`'s primary role is to set up the top-level app structure, including the theme and the navigation host. The \`setContent\` block in the Activity's \`onCreate\` method becomes the root of your Compose UI tree. From there, all UI logic, screen definitions, and navigation are handled by composable functions.
` 
            },
            { 
              id: 'android-l3-2', 
              title: 'Navigation with Compose Navigation', 
              type: 'text', 
              content: `
In a single-Activity app built with Jetpack Compose, navigation between screens is managed by the **Navigation-Compose** library. This library provides a declarative and type-safe way to handle all navigation logic directly in your Kotlin code.

**Core Components:**
1.  **\`NavController\`:** This is the central API for navigation. It keeps track of the back stack of composable destinations and allows you to trigger navigation actions. You create an instance of it using \`rememberNavController()\`.
    \`\`\`kotlin
    val navController = rememberNavController()
    \`\`\`
2.  **\`NavHost\`:** This is a composable that acts as a container for your navigation graph. It links the \`NavController\` with a graph of composable destinations. When you navigate to a new destination, the content of the \`NavHost\` is replaced with the new composable.
3.  **Navigation Graph:** Inside the \`NavHost\`, you define your navigation graph using a builder lambda. You define each screen as a destination using the \`composable(route = "...")\` function. The \`route\` is a unique string that identifies the destination.

**A Simple Example:**
\`\`\`kotlin
@Composable
fun MyApp() {
    val navController = rememberNavController()
    
    NavHost(navController = navController, startDestination = "home") {
        composable("home") { 
            HomeScreen(onNavigateToProfile = { navController.navigate("profile") }) 
        }
        composable("profile") { 
            ProfileScreen(onNavigateBack = { navController.popBackStack() }) 
        }
    }
}
\`\`\`
In this example:
- We create a \`NavHost\` with a starting destination of "home".
- We define two screens: "home" and "profile".
- From the \`HomeScreen\`, we can call \`navController.navigate("profile")\` to move to the profile screen.
- From the \`ProfileScreen\`, we can call \`navController.popBackStack()\` to go back to the home screen.

**Advanced Features:**
- **Passing Arguments:** You can define routes that accept arguments (e.g., \`composable("profile/{userId}")\`) and pass data between screens.
- **Deep Linking:** You can configure deep links to allow users to navigate directly to a specific screen from an external URL.
- **Animated Transitions:** The library supports custom animations for transitions between screens.
`
            },
            { 
              id: 'android-l3-3', 
              title: 'Introduction to MVVM Architecture', 
              type: 'text', 
              content: `
The **Model-View-ViewModel (MVVM)** is the architecture pattern officially recommended by Google for building robust, scalable, and maintainable Android applications. It promotes a clear separation of concerns, which makes your codebase easier to test, debug, and manage as it grows.

The MVVM pattern divides your app into three main layers:

1.  **Model:**
    - This layer represents the **data and business logic** of your application. It is responsible for retrieving and managing data.
    - The Model is not just a simple data class; it includes data sources like a local database (e.g., Room), a remote API (e.g., using Retrofit), or any other data provider.
    - It is completely independent of the UI and has no knowledge of the View or ViewModel. Its sole job is to provide and manipulate data.

2.  **View:**
    - The View is the **UI layer** of the application. In a Jetpack Compose app, the View is your collection of **composable functions**.
    - Its primary responsibility is to display the data provided by the ViewModel and to capture and forward user interactions (like button clicks or text input) to the ViewModel for processing.
    - The View should be as "dumb" as possible. It observes the state exposed by the ViewModel and renders itself accordingly. It should not contain any business logic.

3.  **ViewModel:**
    - The ViewModel acts as a **bridge between the Model and the View**.
    - It holds the UI-related state and exposes it to the View, typically through observable data holders like \`StateFlow\` or \`LiveData\`.
    - It contains the presentation logic. When the View needs data, it requests it from the ViewModel. The ViewModel, in turn, gets the data from the Model, processes it into a displayable format, and updates its state.
    - A key feature of the Android \`ViewModel\` class from the \`androidx.lifecycle\` library is that it is **lifecycle-aware**. This means a ViewModel survives configuration changes, such as a screen rotation, that would normally destroy and recreate the Activity/UI. This prevents data loss and ensures a smooth user experience.

By separating these concerns, MVVM makes your code more modular. You can test your business logic (Model) and presentation logic (ViewModel) independently of the UI framework, leading to a much more stable application.
`
            }
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
            title: 'Module 1: Python Fundamentals',
            lessons: [
                { 
                  id: 'py-l1-1', 
                  title: 'Introduction to Python & Setup', 
                  type: 'text', 
                  content: `
Python is a high-level, interpreted, general-purpose programming language renowned for its simple, clean syntax and readability. Created by Guido van Rossum and first released in 1991, Python's design philosophy emphasizes code readability with its notable use of significant whitespace. This makes it an ideal language for beginners and allows developers to write clear, logical code for small and large-scale projects.

**Why Learn Python?**
- **Easy to Learn:** Python's syntax is designed to be intuitive and similar to plain English.
- **Versatile:** It is used in a wide range of applications, including web development (Django, Flask), data science (Pandas, NumPy), machine learning (TensorFlow, PyTorch), automation, scripting, and more.
- **Large Community & Libraries:** Python has a massive, active community and a vast standard library, as well as a rich ecosystem of third-party packages available through the Python Package Index (PyPI).

**Setting up Your Environment:**
1.  **Install Python:** Download the latest version of Python 3 from the official website, python.org. During installation on Windows, make sure to check the box that says "Add Python to PATH."
2.  **Verify Installation:** Open your command prompt or terminal and type \`python --version\` or \`python3 --version\`. This should display the installed Python version.
3.  **Code Editor:** While you can write Python in a simple text editor, using a code editor or IDE (Integrated Development Environment) will greatly improve your productivity. **Visual Studio Code (VS Code)** is a popular, free choice. After installing VS Code, you should install the official Python extension from the marketplace for features like syntax highlighting, code completion (IntelliSense), and debugging.

**Your First Program:**
Create a new file named \`hello.py\` and add the following line:
\`\`\`python
print("Hello, World!")
\`\`\`
To run this program, navigate to the file's directory in your terminal and execute the command:
\`\`\`bash
python hello.py
\`\`\`
You should see the text "Hello, World!" printed to your console. Congratulations, you've written and executed your first Python program!
` 
                },
                { 
                  id: 'py-l1-2', 
                  title: 'Variables, Data Types, and Type Casting', 
                  type: 'text', 
                  content: `
Variables are containers for storing data values. In Python, you create a variable the moment you first assign a value to it. Python is dynamically typed, which means you do not need to explicitly declare the data type of a variable.

**Variable Assignment:**
\`\`\`python
x = 5           # x is of type int
y = "Python"    # y is of type str
z = 3.14        # z is of type float
\`\`\`

**Core Data Types:**
- **Text Type:** \`str\` (string). Represents textual data, enclosed in single ('') or double ("") quotes.
- **Numeric Types:** 
  - \`int\` (integer): Whole numbers, like 10, -5, 0.
  - \`float\` (floating-point number): Numbers with a decimal point, like 2.5, -0.01.
  - \`complex\`: Complex numbers, like \`1 + 2j\`.
- **Sequence Types:** \`list\`, \`tuple\`, \`range\`.
- **Mapping Type:** \`dict\` (dictionary).
- **Set Types:** \`set\`, \`frozenset\`.
- **Boolean Type:** \`bool\`. Represents one of two values: \`True\` or \`False\`.
- **Binary Types:** \`bytes\`, \`bytearray\`, \`memoryview\`.
- **None Type:** \`NoneType\`. Represents the absence of a value. A variable of this type has only one possible value: \`None\`.

You can get the data type of any object by using the \`type()\` function:
\`\`\`python
print(type(x))  # <class 'int'>
\`\`\`

**Type Casting:**
There may be times when you want to specify a type on to a variable. This can be done with casting. Python is an object-orientated language, and as such it uses classes to define data types, including its primitive types.
Casting in python is therefore done using constructor functions:
- **\`int()\`:** constructs an integer number from an an integer literal, a float literal (by removing all decimals), or a string literal (providing the string represents a whole number).
- **\`float()\`:** constructs a float number from an integer literal, a float literal or a string literal (providing the string represents a float or an integer).
- **\`str()\`:** constructs a string from a wide variety of data types, including strings, integer literals and float literals.

Example:
\`\`\`python
a = int("3")      # a will be 3
b = float(3)      # b will be 3.0
c = str(3.0)      # c will be "3.0"
\`\`\`
` 
                },
                { 
                  id: 'py-l1-3', 
                  title: 'Basic Operators and Input/Output', 
                  type: 'text', 
                  content: `
Operators are special symbols in Python that carry out arithmetic or logical computation.

**Arithmetic Operators:**
- \`+\` Addition: \`x + y\`
- \`-\` Subtraction: \`x - y\`
- \`*\` Multiplication: \`x * y\`
- \`/\` Division: \`x / y\` (always returns a float)
- \`%\` Modulus: \`x % y\` (returns the remainder of the division)
- \`**\` Exponentiation: \`x ** y\` (x to the power of y)
- \`//\` Floor division: \`x // y\` (divides and rounds down to the nearest whole number)

**Assignment Operators:**
Used to assign values to variables.
- \`=\`: \`x = 5\`
- \`+=\`: \`x += 3\` is the same as \`x = x + 3\`
- \`-=\`, \`*=\`, \`/=\`, etc. work similarly.

**Comparison Operators:**
Used to compare two values. They return \`True\` or \`False\`.
- \`==\` Equal: \`x == y\`
- \`!=\` Not equal: \`x != y\`
- \`>\` Greater than: \`x > y\`
- \`<\` Less than: \`x < y\`
- \`>=\` Greater than or equal to: \`x >= y\`
- \`<=\` Less than or equal to: \`x <= y\`

**Logical Operators:**
Used to combine conditional statements.
- \`and\`: Returns \`True\` if both statements are true.
- \`or\`: Returns \`True\` if one of the statements is true.
- \`not\`: Reverses the result, returns \`False\` if the result is true.

**User Input:**
To get input from the user, you can use the \`input()\` function. This function prompts the user for input and returns what they typed as a string.
\`\`\`python
name = input("Enter your name: ")
print("Hello, " + name)
\`\`\`
Note: The \`input()\` function always returns a string. If you need to perform mathematical calculations, you must cast the input to a numeric type, like \`int\` or \`float\`.
\`\`\`python
age_str = input("Enter your age: ")
age = int(age_str)
print("You will be", age + 1, "next year.")
\`\`\`
` 
                },
            ]
        },
        {
            id: 'py-m2',
            title: 'Module 2: Core Data Structures',
            lessons: [
              { 
                id: 'py-l2-1', 
                title: 'Lists - Mutable Sequences', 
                type: 'text', 
                content: `
Lists are one of the most versatile and commonly used data structures in Python. A list is an ordered and mutable (changeable) collection of items. Lists can contain items of different data types, including other lists.

**Creating and Accessing Lists:**
You create a list by placing comma-separated values inside square brackets \`[]\`.
\`\`\`python
my_list = [1, "hello", 3.14, True]
empty_list = []
\`\`\`
You can access items in a list using their index, which starts from 0.
\`\`\`python
fruits = ["apple", "banana", "cherry"]
print(fruits[0])  # Output: apple
print(fruits[-1]) # Output: cherry (negative indexing starts from the end)
\`\`\`

**Modifying Lists:**
Since lists are mutable, you can change their content.
- **Change an item:** \`fruits[1] = "blueberry"\`
- **Add an item to the end:** \`fruits.append("orange")\`
- **Insert an item at a specific position:** \`fruits.insert(1, "mango")\`
- **Remove an item:** 
    - \`fruits.remove("cherry")\` (removes the first occurrence of the value)
    - \`del fruits[0]\` (removes the item at the specified index)
    - \`popped_fruit = fruits.pop()\` (removes and returns the last item)

**List Slicing:**
You can get a range of items from a list using slicing.
\`\`\`python
numbers = [0, 1, 2, 3, 4, 5]
print(numbers[2:5])   # Output: [2, 3, 4]
print(numbers[:3])    # Output: [0, 1, 2]
print(numbers[2:])    # Output: [2, 3, 4, 5]
\`\`\`

**Useful List Methods:**
- \`.sort()\`: Sorts the list in place.
- \`.reverse()\`: Reverses the elements of the list in place.
- \`.copy()\`: Returns a shallow copy of the list.
- \`len(my_list)\`: A built-in function that returns the number of items in a list.

**List Comprehensions:**
A concise and readable way to create lists.
\`\`\`python
# Create a list of squares from 0 to 9
squares = [x**2 for x in range(10)]
# [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]
\`\`\`
` 
              },
              { 
                id: 'py-l2-2', 
                title: 'Tuples - Immutable Sequences', 
                type: 'text', 
                content: `
Tuples are similar to lists in that they are ordered collections of items. However, the key difference is that tuples are **immutable**, meaning their contents cannot be changed after they are created.

**Creating and Accessing Tuples:**
Tuples are created using parentheses \`()\` with comma-separated values.
\`\`\`python
my_tuple = (1, "hello", 3.14)
single_item_tuple = ("apple",) # Note the comma, it's crucial!
\`\`\`
Accessing items in a tuple is done the same way as with lists, using indexing.
\`\`\`python
print(my_tuple[0]) # Output: 1
\`\`\`

**Why Use Tuples?**
If tuples are like "read-only" lists, why would we use them?
1.  **Data Integrity:** When you have data that should not be changed, using a tuple ensures its integrity. For example, a tuple is a good choice for representing a fixed set of coordinates \`(x, y)\` or RGB color values \`(255, 0, 0)\`.
2.  **Performance:** Tuples can be slightly faster than lists in terms of iteration. The performance difference is often negligible but can matter in large-scale applications.
3.  **Dictionary Keys:** Because they are immutable, tuples can be used as keys in a dictionary. Lists, being mutable, cannot.
    \`\`\`python
    location = {
        (35.6895, 139.6917): "Tokyo",
        (40.7128, -74.0060): "New York"
    }
    \`\`\`

**Tuple Operations:**
While you cannot change a tuple, you can perform some operations:
- **Concatenation:** You can combine two tuples to create a new one. \`new_tuple = tuple1 + tuple2\`
- **Tuple Unpacking:** This is a very powerful feature where you can assign the values of a tuple to multiple variables at once.
  \`\`\`python
  coordinates = (10, 20)
  x, y = coordinates
  print(x) # Output: 10
  print(y) # Output: 20
  \`\`\`

You can convert a list to a tuple using \`tuple()\` and a tuple to a list using \`list()\`. This is a common pattern if you need to perform a mutable operation on a tuple's data.
` 
              },
              { 
                id: 'py-l2-3', 
                title: 'Dictionaries - Key-Value Pairs', 
                type: 'text', 
                content: `
Dictionaries are unordered (in Python versions before 3.7) collections of data stored as **key-value pairs**. They are optimized for retrieving a value when you know the key. They are also known as associative arrays, hash maps, or hashmaps in other languages.

**Creating and Accessing Dictionaries:**
Dictionaries are created with curly braces \`{}\`, with each item being a \`key: value\` pair.
\`\`\`python
student = {
    "name": "John Doe",
    "age": 21,
    "major": "Computer Science"
}
empty_dict = {}
\`\`\`
- Keys must be unique and immutable (e.g., strings, numbers, or tuples).
- Values can be of any data type and can be duplicated.

You can access the value associated with a key using square brackets:
\`\`\`python
print(student["name"]) # Output: John Doe
\`\`\`
Using the \`.get()\` method is a safer way to access values, as it returns \`None\` (or a specified default) if the key doesn't exist, instead of raising a \`KeyError\`.
\`\`\`python
print(student.get("id", "Not Found")) # Output: Not Found
\`\`\`

**Modifying Dictionaries:**
Dictionaries are mutable.
- **Add or update an item:** \`student["age"] = 22\`
- **Add a new item:** \`student["university"] = "State University"\`
- **Remove an item:** 
    - \`del student["major"]\`
    - \`student.pop("age")\` (removes the specified key and returns its value)

**Iterating through Dictionaries:**
You can loop through a dictionary in several ways:
- **Iterate through keys:** \`for key in student:\`
- **Iterate through values:** \`for value in student.values():\`
- **Iterate through key-value pairs:** \`for key, value in student.items():\`
  \`\`\`python
  for key, value in student.items():
      print(f"{key}: {value}")
  \`\`\`

**Useful Dictionary Methods:**
- \`.keys()\`: Returns a view object displaying a list of all the keys.
- \`.values()\`: Returns a view object displaying a list of all the values.
- \`.items()\`: Returns a view object displaying a list of key-value tuple pairs.
` 
              },
            ]
        },
        {
            id: 'py-m3',
            title: 'Module 3: Control Flow and Functions',
            lessons: [
              { 
                id: 'py-l3-1', 
                title: 'Conditional Logic with if, elif, else', 
                type: 'text', 
                content: `
Conditional statements allow your program to execute certain blocks of code only when specific conditions are met. They are the core of decision-making in programming.

**The \`if\` Statement:**
The simplest form of conditional logic. The code block inside the \`if\` statement is executed only if the condition evaluates to \`True\`.
\`\`\`python
temperature = 30
if temperature > 25:
    print("It's a hot day!")
print("This will always print.")
\`\`\`

**The \`if-else\` Statement:**
This provides an alternative block of code to execute if the \`if\` condition is \`False\`.
\`\`\`python
age = 17
if age >= 18:
    print("You are eligible to vote.")
else:
    print("You are not eligible to vote yet.")
\`\`\`

**The \`if-elif-else\` Chain:**
The \`elif\` (else if) keyword allows you to check multiple conditions in sequence. This is useful for creating more complex decision trees. Python will execute the block of the first condition that evaluates to \`True\` and then skip the rest of the chain.
\`\`\`python
score = 85
if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "D"
print(f"Your grade is {grade}") # Output: Your grade is B
\`\`\`

**Ternary Operator (Conditional Expression):**
Python provides a concise one-line syntax for a simple \`if-else\` statement.
\`\`\`python
# A simple if-else
if age >= 18:
    message = "Adult"
else:
    message = "Minor"

# The same logic using the ternary operator
message = "Adult" if age >= 18 else "Minor"
\`\`\`
This can make code more readable for simple assignments based on a condition.
` 
              },
              { 
                id: 'py-l3-2', 
                title: 'Loops for Iteration: for and while', 
                type: 'text', 
                content: `
Loops are used to execute a block of code repeatedly. Python has two primary loop constructs: \`for\` and \`while\`.

**The \`for\` Loop:**
The \`for\` loop is used for iterating over a sequence (that is either a list, a tuple, a dictionary, a set, or a string).
\`\`\`python
# Looping through a list
fruits = ["apple", "banana", "cherry"]
for fruit in fruits:
    print(fruit)

# Looping through a string
for char in "Python":
    print(char)
\`\`\`
The \`range()\` function is often used with \`for\` loops to generate a sequence of numbers.
\`\`\`python
# Prints numbers from 0 to 4
for i in range(5):
    print(i)

# Prints numbers from 2 to 5
for i in range(2, 6):
    print(i)
\`\`\`

**The \`while\` Loop:**
The \`while\` loop repeats as long as a certain boolean condition is met. You need to manage the loop variable yourself.
\`\`\`python
count = 0
while count < 5:
    print(count)
    count += 1 # Increment the counter to avoid an infinite loop
\`\`\`

**Loop Control Statements:**
- **\`break\`:** Terminates the loop statement and transfers execution to the statement immediately following the loop.
  \`\`\`python
  for i in range(10):
      if i == 5:
          break # The loop will stop when i is 5
      print(i) # Prints 0, 1, 2, 3, 4
  \`\`\`
- **\`continue\`:** Causes the loop to skip the remainder of its body and immediately retest its condition prior to reiterating.
  \`\`\`python
  for i in range(10):
      if i % 2 == 0: # If the number is even
          continue   # Skip this iteration
      print(i) # Prints 1, 3, 5, 7, 9
  \`\`\`
- **\`else\` Clause:** Both \`for\` and \`while\` loops can have an optional \`else\` block. This block is executed when the loop has finished iterating through the list (with \`for\`) or when the condition becomes false (with \`while\`), but **not** when the loop is terminated by a \`break\` statement.
` 
              },
              { 
                id: 'py-l3-3', 
                title: 'Writing Reusable Functions', 
                type: 'text', 
                content: `
Functions are reusable blocks of code that perform a specific task. Using functions makes your code more modular, organized, readable, and easier to debug.

**Defining a Function:**
You define a function using the \`def\` keyword, followed by the function name and parentheses \`()\`.
\`\`\`python
def greet():
    print("Hello, welcome!")

# Calling the function
greet()
\`\`\`

**Parameters and Arguments:**
Information can be passed into functions as arguments. These arguments are received by parameters in the function definition.
\`\`\`python
def greet_user(name): # 'name' is a parameter
    print(f"Hello, {name}!")

greet_user("Alice") # "Alice" is an argument
\`\`\`

**The \`return\` Statement:**
Functions can return a value to the caller using the \`return\` statement. If no return statement is specified, the function implicitly returns \`None\`.
\`\`\`python
def add(a, b):
    return a + b

sum_result = add(5, 3)
print(sum_result) # Output: 8
\`\`\`

**Positional vs. Keyword Arguments:**
- **Positional Arguments:** The arguments are passed in the order the parameters are defined. \`add(5, 3)\`
- **Keyword Arguments:** You can specify which parameter an argument corresponds to by using the parameter name. The order does not matter. \`add(b=3, a=5)\`

**Default Parameter Values:**
You can provide a default value for a parameter. If an argument for that parameter is not provided during the function call, the default value is used.
\`\`\`python
def power(base, exponent=2):
    return base ** exponent

print(power(3))    # Output: 9 (exponent defaults to 2)
print(power(3, 3)) # Output: 27
\`\`\`

**Docstrings:**
It is good practice to add a documentation string (docstring) as the first statement in your function. It explains what the function does.
\`\`\`python
def add(a, b):
    """This function returns the sum of two numbers."""
    return a + b

# You can access the docstring using help()
help(add)
\`\`\`
` 
              },
            ]
        },
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
            title: 'Module 1: Foundations of Cybersecurity',
            lessons: [
                { 
                  id: 'cs-l1-1', 
                  title: 'The Threat Landscape', 
                  type: 'text', 
                  content: `
The modern digital **threat landscape** is a complex and constantly evolving ecosystem of adversaries, attack vectors, and vulnerabilities. To build an effective defense, we must first understand what we are up against.

**Threat Actors (Adversaries):**
These are the individuals or groups behind cyberattacks. Their motivations and capabilities vary widely.
- **Cybercriminals:** Financially motivated attackers. They use techniques like ransomware (encrypting data and demanding payment), phishing (stealing credentials), and credit card theft.
- **State-Sponsored Actors (APT - Advanced Persistent Threat):** Groups working on behalf of a government to conduct espionage, sabotage, or information warfare. They are highly skilled, well-funded, and patient, often remaining undetected in a network for long periods.
- **Hacktivists:** Motivated by a political or social cause (e.g., Anonymous). They use cyberattacks like DDoS (Distributed Denial of Service) and website defacement to spread their message.
- **Script Kiddies:** Amateur hackers who use existing scripts and tools developed by others to attack systems. They are typically less skilled but can still cause significant disruption.
- **Insider Threats:** Malicious or unintentional threats from individuals within an organization, such as disgruntled employees or careless staff.

**Attack Vectors:**
This is the path or means by which an attacker gains access to a system to deliver a payload or malicious outcome. Common vectors include:
- **Email:** The most common vector, used for phishing, malware delivery, and business email compromise (BEC).
- **Websites:** Malicious websites can exploit browser vulnerabilities or trick users into downloading malware.
- **Removable Media:** USB drives can be used to introduce malware into an air-gapped or secure network.
- **Unpatched Software:** Vulnerabilities in operating systems and applications are a primary target for exploitation.
- **Weak Credentials:** Easily guessable or stolen passwords provide a simple entry point.
` 
                },
                { 
                  id: 'cs-l1-2', 
                  title: 'The CIA Triad and Security Principles', 
                  type: 'text', 
                  content: `
The **CIA Triad** is a foundational model for guiding information security policies and practices. It is composed of three core principles: Confidentiality, Integrity, and Availability.

1.  **Confidentiality:**
    - **Principle:** Ensuring that sensitive information is not disclosed to unauthorized individuals, entities, or processes. It's about protecting data privacy and preventing unauthorized access.
    - **Violations:** A confidentiality breach occurs if someone reads data they are not authorized to read. Examples include a hacker stealing a database of customer credit card numbers or an employee accessing confidential HR records without permission.
    - **Controls:**
        - **Encryption:** Converting data into a code to prevent unauthorized access.
        - **Access Control Lists (ACLs):** Defining who can access what resources.
        - **Authentication:** Verifying the identity of users (e.g., passwords, multi-factor authentication).

2.  **Integrity:**
    - **Principle:** Maintaining the consistency, accuracy, and trustworthiness of data over its entire lifecycle. Data must not be changed in transit, and steps must be taken to ensure data cannot be altered by unauthorized people.
    - **Violations:** An integrity breach occurs if data is modified without authorization. Examples include an attacker changing the amount on a financial transaction or a virus corrupting a system file.
    - **Controls:**
        - **Hashing:** Using algorithms like SHA-256 to create a unique digital fingerprint of data. If the data changes, the hash will change, revealing the tampering.
        - **Digital Signatures:** Using public-key cryptography to verify the authenticity and integrity of a message or document.
        - **File Permissions:** Restricting who can modify files.

3.  **Availability:**
    - **Principle:** Ensuring that information and services are available to authorized users when needed.
    - **Violations:** An availability breach occurs when legitimate users cannot access the data or services they need. The most common example is a Denial-of-Service (DoS) or Distributed Denial-of-Service (DDoS) attack, which overwhelms a server with traffic, making it unavailable. Hardware failures or natural disasters can also cause availability issues.
    - **Controls:**
        - **Redundancy:** Having backup systems (e.g., RAID for disks, failover servers).
        - **DDoS Mitigation Services:** Services that can filter out malicious traffic.
        - **Disaster Recovery Plans:** Procedures to restore services after a major incident.
`
                },
                { 
                  id: 'cs-l1-3', 
                  title: 'Introduction to Risk Management', 
                  type: 'text', 
                  content: `
Cybersecurity risk management is the ongoing process of identifying, assessing, mitigating, and monitoring risks to an organization's information assets. It's impossible to eliminate all risks, so the goal is to reduce them to an acceptable level.

**The Risk Management Process:**
1.  **Identify Assets:** The first step is to know what you need to protect. Assets can be tangible (servers, laptops) or intangible (data, reputation, intellectual property).
2.  **Identify Threats and Vulnerabilities:**
    - **Threat:** Any potential for a security breach (e.g., a malware infection, a phishing attack).
    - **Vulnerability:** A weakness in a system or process that could be exploited by a threat (e.g., an unpatched server, an employee without security training).
3.  **Assess Risk:** Risk is the likelihood of a threat exploiting a vulnerability and the potential impact it would have on the organization. A common formula is:
    *Risk = Likelihood × Impact*
    This is often done using a qualitative scale (e.g., Low, Medium, High) or a quantitative one (assigning monetary values). A risk assessment matrix is a useful tool to visualize and prioritize risks.

4.  **Treat the Risk:** Once risks are assessed and prioritized, you must decide how to handle them. There are four main strategies:
    - **Mitigate (or Remediate):** Implement controls to reduce the likelihood or impact of the risk. This is the most common approach. For example, installing antivirus software to mitigate the risk of malware.
    - **Transfer (or Share):** Shift the risk to a third party. The most common example is buying cybersecurity insurance. Outsourcing a service can also transfer some of the associated risk.
    - **Accept:** If the cost of mitigating the risk is greater than the potential impact, or if the risk is very low, an organization might choose to formally accept it. This must be a conscious and documented decision.
    - **Avoid:** Stop performing the activity that creates the risk. For example, if a legacy application is too insecure to protect, the organization might decide to decommission it entirely.

5.  **Monitor and Review:** Risk management is not a one-time process. New threats and vulnerabilities emerge constantly. The organization must continuously monitor its security posture and review its risk assessment to adapt to the changing landscape.
` 
                }
            ]
        },
        {
            id: 'cs-m2',
            title: 'Module 2: Network and Application Security',
            lessons: [
              { 
                id: 'cs-l2-1', 
                title: 'Common Web Application Attacks', 
                type: 'text', 
                content: `
Web applications are one of the most common targets for cyberattacks. Understanding the most frequent types of attacks is essential for building secure applications.

**1. SQL Injection (SQLi):**
- **What it is:** An attack where a malicious actor inserts or "injects" a malicious SQL query into an input field, which is then passed to the application's database.
- **Impact:** If the application does not properly sanitize the input, the malicious query can be executed, allowing the attacker to bypass authentication, view, modify, or delete data in the database.
- **Prevention:** The primary defense is to use **Parameterized Queries** (also known as Prepared Statements). This ensures that user input is always treated as data and never as executable code.

**2. Cross-Site Scripting (XSS):**
- **What it is:** An attack where a malicious script is injected into a trusted website. When another user visits the page, the malicious script runs in their browser.
- **Types:**
    - **Stored XSS:** The malicious script is permanently stored on the target server (e.g., in a database, in a comment field).
    - **Reflected XSS:** The script is embedded in a URL and is reflected off the web server to the victim's browser.
- **Impact:** XSS can be used to steal user session cookies, deface websites, or redirect users to malicious sites.
- **Prevention:** The key is **Output Encoding**. Before rendering user-provided content in a web page, you must encode special HTML characters (like \`<\`, \`>\`, \`"\`) so the browser treats them as text, not as code.

**3. Cross-Site Request Forgery (CSRF or XSRF):**
- **What it is:** An attack that tricks an authenticated user into submitting a malicious request they did not intend to. For example, an attacker could craft a link that, when clicked by a logged-in user, transfers money from the user's bank account.
- **Impact:** The attacker can perform any state-changing action that the authenticated user is authorized to perform.
- **Prevention:** The most common defense is using **Anti-CSRF Tokens**. The server generates a unique, unpredictable token for each user session and requires that token to be included in all state-changing requests.

**4. Insecure Deserialization:**
- **What it is:** This flaw occurs when an application deserializes (unpacks) data from untrusted sources without sufficient validation. Attackers can manipulate the serialized object data to execute arbitrary code on the server upon deserialization.
- **Impact:** Can lead to remote code execution, denial of service, and other serious vulnerabilities.
- **Prevention:** Avoid deserializing data from untrusted sources. If necessary, use a "safe" serialization format (like JSON) and implement strict type checking during the deserialization process.
` 
              },
              { 
                id: 'cs-l2-2', 
                title: 'Network Security Tools and Concepts', 
                type: 'text', 
                content: `
Securing a network involves a layered approach, often called "Defense in Depth." Several key tools and concepts form the foundation of network security.

**1. Firewalls:**
- **Function:** A firewall is a network security device that monitors and filters incoming and outgoing network traffic based on an organization's previously established security policies. It acts as a barrier between a trusted internal network and an untrusted external network (like the Internet).
- **Types:**
    - **Packet-Filtering Firewalls:** Operate at the Network layer (Layer 3). They make decisions based on IP addresses, ports, and protocols. They are fast but don't inspect the content of the traffic.
    - **Stateful Inspection Firewalls:** Keep track of the state of network connections. They are more intelligent than packet-filtering firewalls and can block traffic that doesn't belong to a legitimate, established session.
    - **Next-Generation Firewalls (NGFW):** These are more advanced firewalls that include features like deep packet inspection (DPI), intrusion prevention (IPS), and application-level awareness.

**2. Intrusion Detection and Prevention Systems (IDS/IPS):**
- **Intrusion Detection System (IDS):** A device or software application that monitors a network or systems for malicious activity or policy violations. An IDS only detects and reports the threat; it does not take action to stop it.
- **Intrusion Prevention System (IPS):** An extension of an IDS that can also actively block or prevent the detected threat. An IPS is placed in-line with the traffic and can drop malicious packets, block traffic from an offending IP address, or reset a connection.

**3. Virtual Private Network (VPN):**
- **Function:** A VPN creates a secure, encrypted connection (a "tunnel") over a public network like the Internet. This allows remote users to securely access corporate resources as if they were directly connected to the internal network. It ensures the confidentiality and integrity of the data in transit.

**4. Network Segmentation:**
- **Concept:** The practice of dividing a computer network into smaller, isolated subnetworks or segments. This limits the "blast radius" of a security breach. If an attacker compromises one segment, they cannot easily move laterally to other parts of the network. This is a key principle of a Zero Trust architecture. Segmentation can be achieved physically or logically using VLANs (Virtual LANs) and firewalls.
`
              },
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
            title: 'Module 1: Foundations of Networking',
            lessons: [
                { 
                  id: 'dcn-l1-1', 
                  title: 'What is a Computer Network?', 
                  type: 'text', 
                  content: `
A computer network is a system of interconnected computing devices that can exchange data and share resources. This simple definition underlies the entire modern digital world.

**Core Components of a Network:**
- **Nodes/Hosts:** These are the devices on the network, such as computers, servers, smartphones, printers, and IoT devices.
- **Communication Medium:** The physical path through which data travels. This can be **wired** (like Ethernet cables, fiber optic cables) or **wireless** (like Wi-Fi, Bluetooth, cellular).
- **Network Devices:** Hardware that connects nodes and manages traffic flow, such as routers, switches, and hubs.
- **Protocols:** A set of rules that govern how data is formatted, transmitted, and received. Protocols ensure that devices can understand each other (e.g., TCP/IP, HTTP).

**Types of Networks by Scale:**
- **LAN (Local Area Network):** Covers a small geographical area, such as a single home, office, or school building. Usually owned and managed by a single entity. Ethernet and Wi-Fi are common LAN technologies.
- **MAN (Metropolitan Area Network):** Spans a larger area than a LAN, such as a city or a large campus. It might connect several LANs together.
- **WAN (Wide Area Network):** Connects networks over a large geographical area, such as across cities, countries, or continents. The Internet is the largest example of a WAN. WANs often use leased telecommunication circuits.

**Network Topologies:**
Topology refers to the physical or logical arrangement of nodes in a network.
- **Bus:** All nodes are connected to a single central cable. Simple but not robust.
- **Star:** All nodes are connected to a central device (like a switch or hub). Easy to manage, but the central device is a single point of failure. This is the most common topology for modern LANs.
- **Ring:** Nodes are connected in a circle. Data travels in one direction.
- **Mesh:** Every node is connected to every other node (full mesh) or to several other nodes (partial mesh). Highly redundant and reliable but expensive to implement.
` 
                },
                { 
                  id: 'dcn-l1-2', 
                  title: 'The OSI Model Explained', 
                  type: 'text', 
                  content: `
The **Open Systems Interconnection (OSI) model** is a conceptual framework that standardizes the functions of a telecommunication or computing system into seven abstract layers. It was developed to ensure interoperability between different vendors and network technologies. Think of it as a universal blueprint for how networks should work.

**The 7 Layers of the OSI Model (from bottom to top):**

**Layer 1: Physical Layer**
- **Function:** Transmits raw, unstructured bits over a physical medium.
- **Responsibilities:** Defines the physical characteristics of the network, such as the type of cables (e.g., copper, fiber), voltage levels, pinouts, and data rates. It's all about the hardware that moves the 1s and 0s.
- **Example:** Ethernet cables, Wi-Fi radio signals.

**Layer 2: Data Link Layer**
- **Function:** Organizes bits into frames and provides node-to-node data transfer between two directly connected nodes.
- **Responsibilities:** It handles physical addressing using **MAC addresses**, error detection (using techniques like CRC), and flow control.
- **Sublayers:** Often divided into the LLC (Logical Link Control) and MAC (Media Access Control) sublayers.
- **Example:** Ethernet, Switches, MAC addresses.

**Layer 3: Network Layer**
- **Function:** Responsible for routing packets from a source host to a destination host across one or more networks.
- **Responsibilities:** Logical addressing using **IP addresses**, path determination (routing), and forwarding.
- **Example:** Routers, IP (Internet Protocol).

**Layer 4: Transport Layer**
- **Function:** Provides host-to-host communication services for applications.
- **Responsibilities:** Segmentation of data into smaller chunks, flow control, and error control. It can be connection-oriented (reliable) or connectionless.
- **Example:** TCP (Transmission Control Protocol), UDP (User Datagram Protocol).

**Layer 5: Session Layer**
- **Function:** Establishes, manages, and terminates sessions (connections) between applications.
- **Responsibilities:** Dialogue control (managing whose turn it is to transmit) and synchronization (placing checkpoints in the data stream).
- **Example:** APIs like NetBIOS.

**Layer 6: Presentation Layer**
- **Function:** Translates, encrypts, and compresses data, ensuring it is in a usable format for the Application Layer.
- **Responsibilities:** Character code translation (e.g., ASCII to EBCDIC), data encryption/decryption, and data compression.
- **Example:** SSL/TLS (for encryption), JPEG, MPEG (for data formats).

**Layer 7: Application Layer**
- **Function:** Provides network services directly to the end-user's applications. This is the layer that the user and application software interact with.
- **Responsibilities:** Identifies communication partners, determines resource availability, and provides protocols for specific applications.
- **Example:** HTTP (for web browsing), FTP (for file transfer), SMTP (for email).
` 
                },
                { 
                  id: 'dcn-l1-3', 
                  title: 'The TCP/IP Model and Comparison', 
                  type: 'text', 
                  content: `
While the OSI model is a comprehensive theoretical framework, the **TCP/IP model** is the practical model upon which the modern internet is built. It is simpler, with fewer layers.

**The 4 Layers of the TCP/IP Model:**

**1. Network Access Layer (or Link Layer)**
- **Function:** Combines the functions of the OSI Physical (Layer 1) and Data Link (Layer 2) layers.
- **Responsibilities:** It handles all the hardware details of physically interfacing with the network medium. It places TCP/IP packets into network frames.
- **Protocols:** Ethernet, Wi-Fi, etc.

**2. Internet Layer**
- **Function:** Corresponds to the OSI Network Layer (Layer 3).
- **Responsibilities:** It is responsible for logical addressing, routing, and packaging data into packets (specifically, IP datagrams). It provides the "best-effort" delivery of packets across networks.
- **Protocols:** IP (Internet Protocol), ICMP, ARP.

**3. Transport Layer**
- **Function:** Corresponds to the OSI Transport Layer (Layer 4).
- **Responsibilities:** Provides data flow between hosts, managing communication sessions. It is responsible for end-to-end data integrity and can provide reliable or unreliable delivery.
- **Protocols:** TCP (Transmission Control Protocol) for reliable, connection-oriented communication, and UDP (User Datagram Protocol) for fast, connectionless communication.

**4. Application Layer**
- **Function:** Combines the functions of the OSI Session, Presentation, and Application layers (Layers 5, 6, 7).
- **Responsibilities:** It contains the protocols that user applications interact with directly to exchange data.
- **Protocols:** HTTP, SMTP, FTP, DNS, etc.

**Comparison: OSI vs. TCP/IP**

| Feature              | OSI Model                                    | TCP/IP Model                                 |
| -------------------- | -------------------------------------------- | -------------------------------------------- |
| **Layers**           | 7 Layers                                     | 4 Layers                                     |
| **Development**      | Developed by ISO. A theoretical, generic model. | Developed for the ARPANET. A practical model. |
| **Approach**         | "Vertical" - Layers are well-defined.        | "Horizontal" - Focuses on protocols.         |
| **Reliability**      | Both connection-oriented and connectionless communication are supported at the Network layer. | The Transport layer handles reliability (TCP). The Internet layer (IP) is connectionless. |
| **Protocol Dependency**| The model was defined before the protocols. | The protocols were developed first, then the model was described. |
| **Usage**            | Used as a reference model for teaching and understanding network functions. | The basis for the modern Internet.             |
` 
                },
            ]
        },
        {
            id: 'dcn-m2',
            title: 'Module 2: Transport and Network Layers Deep Dive',
            lessons: [
                { 
                  id: 'dcn-l2-1', 
                  title: 'TCP vs. UDP in Detail', 
                  type: 'text', 
                  content: `
The Transport Layer provides end-to-end communication between hosts. The two primary protocols, TCP and UDP, offer different services to the Application Layer.

**TCP (Transmission Control Protocol):**
TCP is designed for **reliability**.
- **Connection-Oriented:** Before any data is sent, TCP establishes a reliable connection between the two hosts using a process called the **three-way handshake** (SYN, SYN-ACK, ACK). This ensures both ends are ready to communicate.
- **Reliable Delivery:** TCP guarantees that data will be delivered. It uses sequence numbers to track packets and acknowledgments (ACKs) to confirm receipt. If a packet is lost, TCP will retransmit it.
- **Ordered Delivery:** TCP ensures that data is delivered to the application layer in the same order it was sent. It reorders any packets that arrive out of sequence.
- **Flow Control:** TCP uses a sliding window mechanism to manage the rate of data transmission, preventing a fast sender from overwhelming a slow receiver.
- **Congestion Control:** TCP has built-in mechanisms to detect network congestion and slow down transmission rates to avoid collapsing the network.
- **Use Cases:** Web browsing (HTTP/HTTPS), email (SMTP, IMAP), file transfer (FTP). Any application where data integrity and order are critical.

**UDP (User Datagram Protocol):**
UDP is designed for **speed and simplicity**.
- **Connectionless:** UDP does not establish a connection before sending data. It simply sends packets (called datagrams) to the destination. There is no handshake.
- **Unreliable Delivery:** UDP provides no guarantee of delivery. Packets can be lost, duplicated, or arrive out of order. There are no ACKs or retransmissions. It's often called a "send and pray" protocol.
- **No Ordering:** UDP does not ensure packets are delivered in sequence.
- **Low Overhead:** Because it doesn't have the complex mechanisms of TCP, a UDP header is much smaller and simpler, resulting in less processing and faster transmission.
- **Use Cases:** Real-time applications where speed is more important than perfect reliability. Examples include video/audio streaming (where a lost packet is a minor glitch), online gaming, and DNS queries.
` 
                },
                { 
                  id: 'dcn-l2-2', 
                  title: 'IP Addressing, Subnetting, and CIDR', 
                  type: 'text', 
                  content: `
An **Internet Protocol (IP) address** is a unique numerical label assigned to each device participating in a computer network that uses the Internet Protocol for communication.

**IPv4 Addressing:**
- An IPv4 address is 32 bits long, typically written as four decimal numbers separated by dots (dotted-decimal notation), where each number represents 8 bits (an octet). Example: \`192.168.1.1\`.
- The address space is approximately 4.3 billion addresses.

**Subnetting:**
Subnetting is the process of dividing a single large network into multiple smaller, more manageable networks, or "subnets."
- **Why Subnet?**
    - **Improved Performance:** It reduces the volume of network-wide broadcast traffic, which can consume bandwidth and processing power on every device.
    - **Enhanced Security:** You can create boundaries between subnets, allowing you to apply security policies to control traffic flow between them.
    - **Simplified Management:** Smaller networks are easier to troubleshoot and manage.
- **How it Works:** Subnetting is done using a **subnet mask**. A subnet mask is also a 32-bit number that looks like an IP address (e.g., \`255.255.255.0\`). It is used to separate the network portion of an IP address from the host portion. By "borrowing" bits from the host portion to use for the network portion, you can create multiple subnet IDs.

**CIDR (Classless Inter-Domain Routing):**
CIDR was introduced to solve the rapid exhaustion of IPv4 addresses and to reduce the size of global routing tables. It supersedes the old "classful" system of networking (Class A, B, C).
- **How it Works:** CIDR uses a **prefix notation** to represent the network mask. This is a slash followed by a number that indicates how many bits are in the network portion of the address.
- **Example:**
    - The address \`192.168.1.0\` with a subnet mask of \`255.255.255.0\` is written in CIDR notation as \`192.168.1.0/24\`. The \`/24\` indicates that the first 24 bits are the network portion, and the remaining 8 bits are for hosts.
- **Benefits:** CIDR allows for much more flexible and efficient allocation of IP addresses, a practice known as Variable Length Subnet Masking (VLSM).
` 
                },
            ]
        }
    ]
  }
];
