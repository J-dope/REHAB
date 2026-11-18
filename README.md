# REHAB - Habit & Recovery Tracker App

* **Student Name:** E.M.J.M Ekanayaka
* **Student Number:** PS/2022/049
* **Demonstration Video Link:** [Google Drive Link](https://drive.google.com/file/d/1KIZ2yIfR79q6cr2_XqgbHSCSrhndtZLd/view?usp=drivesdk)

---

## 1. Application Overview & Problem Solved
**REHAB** is a mobile habit-tracking and addiction-recovery management application built using React Native and Expo Router. 

* **The Problem:** Breaking harmful habits, managing daily routines, and maintaining consistency during personal recovery programs can be overwhelming without structure. Many individuals struggle to track their progress, stay accountable, or remember crucial daily milestones.
* **The Solution:** REHAB provides a clean, distraction-free Dark Mode environment to track clean days, monitor daily positive habits, complete mandatory daily check-in questionnaires with a scoring system (100-point scale), and utilize automated local notifications to stay on track.

---

## 2. Screens & Navigation Structure (Expo Router)
The application utilizes file-based routing via Expo Router, featuring a tab-based navigation layout coupled with nested stack components.

* **`app/(tabs)/index.tsx` (Home / Dashboard Screen):** 
  * Displays the special pinned counter tracking days/hours/minutes clean.
  * Houses the Daily Check-in Questionnaire banner and the Mood Tracker.
  * Features the balanced Rehab Programs and Habit Tracker sections with completion toggles and progress percentages.
  * Includes the 21-Day Recovery Milestone timeline.
* **`app/(tabs)/_layout.tsx` (Tab Layout):** Configures bottom tab navigation, handling active state tints and styling matching the app's Dark Mode theme.

---

## 3. Core React Native Components Used
The application implements native components to ensure a seamless UI experience:
* **`View` & `Text`:** Used across all screens for structural layout and displaying application titles, countdown stats, and questionnaire prompts.
* **`Pressable`:** Utilized extensively for interactive buttons, mood selection cards, checkbox toggles, and modal triggers.
* **`ScrollView`:** Enables smooth vertical scrolling across the entire dashboard layout to accommodate custom trackers and timelines.
* **`Modal`:** Used for interactive pop-ups including the Daily Check-in Questionnaire, Habit creation/editing form, Rehab program manager, and Pinned Counter configuration.
* **`FlatList` / Mapped Lists:** Used to render dynamic lists of habits, rehab programs, and timeline milestone nodes.

---

## 4. State Management & Native APIs
* **Global & Local State Management:** State is managed across screens using standard React `useState` and `useEffect` hooks. User actions (such as completing daily habits, finishing rehab tasks, submitting questionnaires, and configuring the pinned counter) update states dynamically to recalculate progress bars and score percentages.
* **AppState API:** Utilizes React Native's `AppState` listener to detect when the application transitions from the background to the foreground, helping monitor user session activity.
* **Local Notifications (`expo-notifications`):** 
  * **Research & Implementation:** Integrated `expo-notifications` to handle both scheduled daily reminders (e.g., the 8:00 AM Daily Check-in reminder) and instant trigger notifications (e.g., "Well Done!" notifications dispatched immediately upon completing the daily questionnaire).
  * Notification behavior is configured via `setNotificationHandler` to display clean system status bar notifications while suppressing unnecessary in-app alerts.

---

## 5. Local Setup & Execution Instructions

Follow these steps to clone, install dependencies, and run the project locally:

### Prerequisites
Ensure you have **Node.js** and **npm** (or Yarn) installed on your machine, along with the Expo CLI.

### Steps
1. **Clone the repository:**
   ```bash
   git clone https://github.com/J-dope/REHAB.git