The goal of this task was to reorganize a large, unstructured domain model into smaller modules with high cohesion and low coupling. A module groups related domain concepts that naturally belong together based on their purpose in the system. This refactoring improves communication, supports clearer system understanding, and makes future development easier.

Diagrames worked on:
Before: A single, large model with all concepts connected
After: A modularized model separated into four meaningful modules

> Before Model Overview
In the original model, all concepts such as User, Profile, Listings, Item Attributes, Price, and Favorites were placed together in a single structure. Every relationship crossed over one another without organization or separation of responsibilities.

This resulted in a domain model that was:

• Difficult to read and understand
• Hard to maintain as the project grows
• Lacking clear ownership of concepts
• Less effective as a communication tool for the team

The before diagram reflects this unstructured state.

> After Model Overview
To improve clarity and structure, the domain was reorganized into three modules:

- Identity Module
- Listing Module
- Favorites Module

Each module contains related concepts with a shared purpose. Relationships exist only where needed, rather than between scattered individual entities. This approach makes the domain cleaner, simpler, and easier to reason about.

Module Descriptions and Boundaries

> Identity Module

Contains:
- User  
- Profile  

Implements in the app:

- auth, login, sign-up, profile, profilepage, providers

The Identity module focuses on everything related to who is using the system and their basic information. User and Profile share the same area of responsibility, which is authentication and personal details. These concepts do not manage listings or favorites, which reduces coupling with other modules.

>> Listing Module

Contains:
- Listing  
- Item Attributes (category, size, condition, images, description)  
- Price  

Implements in the app:

- homepage, browsing, listings, map

The Listing module represents the core of the clothing exchange platform. A Listing is the clothing item being offered, Item Attributes describe its characteristics, and Price is its cost or zero for donated items. These concepts together describe a clothing post, so they belong in the same module.

This module appears throughout the UI in browsing pages, the listings view, map based discovery, and the homepage.

>> Favorites Module

Contains:
- Favorite  

Implements in the app:
- Favorites page

The Favorites module models how users save items they like. A Favorite connects a User to a Listing, but it belongs to neither the user's identity nor the listing data. It represents a user interaction. Separating Favorites into its own module avoids mixing concerns with Identity or Listing logic.

> Cohesion and Coupling Justification
Each module contains concepts that naturally belong together which increases cohesion:

• Identity, user accounts and profile information
• Listing, clothing items and their descriptive attributes
• Favorites, items saved for later by a user

Modules depend on each other only through simple and intentional relationships which reduces coupling:

• The Identity module references Listings when a user creates or interacts with them
• The Favorites module links users to listings without needing internal details of either

This structure prevents tangled dependencies and keeps the domain clean.

> Before vs After Comparison
Before:
A single cluttered model with no separation of concerns. Understanding relationships between User, Listing, Item Attributes, Price, and Favorites required navigating a tangled diagram.

After:
The domain is separated into three clear modules. Each module contains related concepts and only essential interactions occur between them. The model is now cleaner, more readable, and more useful as a design and communication tool.

> Contribution to the Project

Modularizing the domain benefits the Hand Me Down Clothing project by:

• Making the system’s structure easier to understand for new team members
• Clarifying where new features should belong, such as listing filters or profile options
• Preventing accidental mixing of unrelated responsibilities
• Aligning the domain model with the real folder structure in the repository such as auth, profile, listings, and Favorites
• Supporting future growth with a clean and maintainable architecture

This refactoring strengthens the project and supports more predictable development.
