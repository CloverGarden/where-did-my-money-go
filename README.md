# Where Did My Money Go?

> **From “Where did it go?” to “Where should it go?”**

**Where Did My Money Go?** is a student-focused budgeting application designed to help university students understand their spending, manage their allowance, and make their money last until the next allowance.

Unlike a budgeting app that only records past expenses, this app provides simple guidance to help students decide **how much they can safely spend today** and whether they can afford a purchase.

---

## Problem

Many university students receive a fixed allowance but may struggle to manage it throughout the month. They often know where their money went only after spending it, making it difficult to control unnecessary expenses.

**Where Did My Money Go?** aims to make budgeting easier by turning spending data into simple and actionable information.

---

## Main Features

### 1. Daily Safe-to-Spend
Calculates how much money the user can safely spend each day based on their available balance, remaining days, upcoming expenses, and savings target.

> **Answers:** “How much can I still spend today?”

### 2. Expense Tracking
Allows users to quickly record expenses by category, such as:
- Food
- Transport
- Campus
- Shopping
- Entertainment
- Bills
- Other

Users can also classify expenses as **Need** or **Want**.

### 3. Mood Wallet
An interactive wallet mascot that reflects the user's financial condition:

- 🟢 **Very Healthy** — financial condition is safe
- 🟡 **Starting to Run Low** — time to be more careful
- 🔴 **Critical** — spending should be reduced

Users can also customize the mascot with different outfits, accessories, and expressions.

### 4. Can I Afford It?
Helps users evaluate a potential purchase before spending by considering their current financial situation.

The feature gives a simple recommendation such as:
- **Yes, you can afford it**
- **You can, but it may affect your budget**
- **Maybe wait for now**

### 5. Spending Analytics
Provides a simple overview of spending habits, including:
- Total weekly spending
- Average spending
- Spending by category
- Need vs. Want comparison
- Top spending categories
- Comparison with the previous week
- Spending habits and insights

### 6. Split & Debts
Helps students manage shared expenses with friends.

Users can:
- Create a new split bill
- Split expenses equally or by custom amounts
- Track who owes them
- Track who they owe
- Mark debts as paid
- Send friendly debt reminders

### 7. Savings Goals
Allows users to create financial goals such as:
- New headphones
- Laptop
- Holiday
- College-related needs

Users can monitor their progress and add money toward their goals.

### 8. Streak & Rewards
Encourages users to consistently record their expenses through a streak system.

Users earn **Streak Points** that can be used to unlock additional Mood Wallet customization options.

### 9. Allowance Management
Users can manage their allowance amount and schedule, including:
- Monthly allowance
- Allowance date
- Weekly savings target
- Default spending categories

This information is used to support the app's budgeting recommendations.

### 10. Personalized Notifications
Users can manage notifications for:
- Daily Safe-to-Spend
- Spending warnings
- Debt reminders
- Weekly recap

---

## Target Users

**Primary target users:** University students aged approximately 18–24.

The application is especially designed for students who:
- Receive a regular allowance
- Use cash, debit cards, or e-wallets
- Often spend on food, transportation, entertainment, and shopping
- Have difficulty controlling daily spending
- Want a simple way to manage their money

---

## Core User Questions

The application is designed around three main questions:

1. **Where did my money go?**
2. **How much can I spend today?**
3. **Will my money last until my next allowance?**

---

## User Flow

The main concept of the application follows:

**Track → Understand → Guide → Control**

1. **Track** spending through Expense Tracking.
2. **Understand** spending patterns through Spending Analytics.
3. **Guide** spending through Daily Safe-to-Spend and Can I Afford It?
4. **Control** finances through Savings Goals, Need vs. Want, and allowance management.

---

## Prototype Screens

The prototype includes several screens covering the main user journey:

- Splash Screen
- Onboarding
- Allowance Setup
- Savings Target Setup
- Home Dashboard
- Quick Add Expense
- Expense Details
- Can I Afford It?
- Spending Analytics
- Weekly Spending Details
- Split & Debts
- Create Split
- Debt Details
- Friendly Debt Reminder
- Savings Goals
- Goal Details
- Mood Wallet Customization
- Streak & Rewards
- Profile
- Money Settings
- Notification Settings
- Student Premium

The prototype uses a mobile-first interface with a friendly, simple, and student-oriented design. The Home screen focuses on available balance, Safe-to-Spend, Mood Wallet, and recent expenses.

---

## Technologies

- **HTML**
- **CSS**
- **JavaScript**
- **SVG** for the Mood Wallet mascot
- **Google Fonts**: Quicksand and Inter

The current prototype is implemented as a front-end web application. The JavaScript handles interactions such as adding/editing/deleting expenses, calculating spending effects, managing debts, savings goals, and analytics.

---

## Project Structure

```text
Where-Did-My-Money-Go/
│
├── where_did_my_money_go.html
├── app.js
├── style.css
└── README.md
```

### File Description

| File | Description |
|---|---|
| `where_did_my_money_go.html` | Contains the application's screens and interface structure |
| `app.js` | Handles application logic and user interactions |
| `style.css` | Contains the visual styling and layout |
| `README.md` | Project documentation |

---

## Prototype Limitations

This version is a **front-end prototype** created to demonstrate the application's main features and user experience.

Some features are simulated and do not yet use a real backend or external financial data source. For example, the prototype currently uses sample expenses, debts, and savings goals stored in JavaScript. 

---

## Future Development

Possible improvements for future versions include:

- User authentication and accounts
- Database integration
- Automatic bank and e-wallet synchronization
- Real-time financial data
- More advanced spending recommendations
- Mobile application deployment
- Cloud data synchronization
- More personalized financial insights

---

## Conclusion

**Where Did My Money Go?** aims to make financial management more approachable for university students. Instead of simply showing users where their money went, the application helps them understand their spending and make better decisions before their money runs out.

> **From “Where did it go?” to “Where should it go?”**
