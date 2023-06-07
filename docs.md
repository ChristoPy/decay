# Basics
This document describes the basics of Decay.

It can create functional and declarative user interfaces for the web.
Every aspect of Decay is designed to be simple and easy to use. All patterns are reused by the language, so it is easy to learn and remember its syntax.

# View
A view is a block of code that is rendered to the screen. Views are defined using the `view` keyword and can contain other components.

```swift
view MyView {
  Text("Hello, World!")
}
```

# Component
A component is a reusable block of code that can be used in multiple views. Components are defined using the `component` keyword and can contain other components.

```swift
component GreetingsComponent {
  Title("Hello, World!")
}
```

Components can be used in views by calling the component name as a function.

```swift
view MyView {
  GreetingsComponent()
}
```

# Properties
Components can have properties. Properties are defined after the component name and are separated by commas.

```swift
component GreetingsComponent (name) {
  Title("Hello, {name}!")
}
component ManyGreetingsComponent (name1, name2) {
  Title("Hello, {name} and {name2}!")
}
```
