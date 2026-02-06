# Beginner's Guide to Git & GitHub Secrets

This guide is designed for someone with **zero technical background**. It will walk you through saving your code changes to the cloud (GitHub) and setting up the secure passwords (Secrets) needed for your application to build automatically.

---

## 📚 Glossary: Key Terms

Before we start, here are 5 words you need to know:

1.  **Repository (Repo)**: Think of this as a "Project Folder" that lives on the internet (GitHub). It holds all your code.
2.  **Commit**: A "Save Point". When you commit, you are taking a snapshot of your code at that specific moment. You usually add a message like "Fixed login bug" to remember what you changed.
3.  **Push**: "Upload". After you make a local Save Point (Commit), you "Push" it up to the internet (GitHub) so others can see it and your backup is safe.
4.  **Secret**: A password or key (like an API Key) that is too sensitive to show in the code. We store these in a special secure vault on GitHub.
5.  **CI/CD (Pipeline)**: "Automated Robot". When you Push your code, this robot wakes up, runs tests to make sure you didn't break anything, and packages your app for release.

---

## 🚀 Part 1: Pushing Your Changes

We will use the **Command Line** (Terminal) inside your editor because it is the most reliable method.

### Step-by-Step Instructions:

1.  **Open the Terminal**:
    *   Look at the bottom of your screen in the IDE (Trae). You should see a panel with tabs like "Terminal", "Output", etc. Click **Terminal**.

2.  **Check Status**:
    *   Type the following command and press **Enter**:
        ```bash
        git status
        ```
    *   **Visual Cue**: You will see a list of files in **Red** (modified but not staged) or **Green** (ready to be saved). If it says "nothing to commit", you have no changes to save.

3.  **Stage Changes (Prepare to Save)**:
    *   Type this command and press **Enter**:
        ```bash
        git add .
        ```
    *   *Explanation*: The `.` means "everything". You are telling Git, "I want to include ALL my changes in the next save."

4.  **Commit (Save)**:
    *   Type this command and press **Enter**:
        ```bash
        git commit -m "Prepare app for production deployment"
        ```
    *   *Explanation*: The text inside the quotes `""` is your note about what you did.
    *   **Visual Cue**: You will see a list of files scroll by, saying "create mode..." or "rewrite...".

5.  **Push (Upload)**:
    *   Type this command and press **Enter**:
        ```bash
        git push origin main
        ```
    *   *Explanation*: Send my saved changes to the "origin" (GitHub) on the "main" branch.
    *   **Visual Cue**: You might see a progress bar (0%... 100%). When it finishes, it will return you to the command prompt.

---

## 🔐 Part 2: Configuring GitHub Secrets

Now that your code is on GitHub, we need to give the "Automated Robot" (CI/CD) the keys to your database. It cannot read them from your local computer.

### Detailed Walkthrough:

1.  **Go to Your Repository**:
    *   Open your web browser and go to `github.com`.
    *   Click on your profile picture in the top right -> **Your repositories**.
    *   Click on the name of your project (e.g., `marsana-fleet`).

2.  **Navigate to Settings**:
    *   Look at the top horizontal menu bar of your repository (Code, Issues, Pull requests...).
    *   Click on the last option: **⚙️ Settings**.

3.  **Find the Secrets Menu**:
    *   Look at the **Left Sidebar**. Scroll down until you see a section called **Security**.
    *   Click **Secrets and variables**.
    *   A sub-menu will open. Click **Actions**.

4.  **Add a New Secret**:
    *   Find the green button in the center-right of the screen: **New repository secret**. Click it.

5.  **Enter Secret Details**:
    *   **Name**: Enter the EXACT name of the key (in ALL CAPS).
    *   **Secret**: Paste the secret value (the long string of random characters).
    *   Click the green **Add secret** button.

### List of Secrets You Need to Add:

Repeat Step 4 & 5 for each of these:

| Name (Copy this) | Value (Where to find it) |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your `.env.local` file or Supabase Dashboard |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your `.env.local` file or Supabase Dashboard |
| `SUPABASE_SERVICE_ROLE_KEY` | Your `.env.local` file or Supabase Dashboard (Settings > API) |

---

## ✅ Part 3: Verifying the Pipeline

After you pushed your code (Part 1) and added secrets (Part 2), let's see if the robot is working.

1.  **Go to the Actions Tab**:
    *   In your GitHub repository, look at the top horizontal menu again.
    *   Click on **▶️ Actions**.

2.  **Check the Workflow**:
    *   You should see a list of "Workflows". The top one should match your commit message (e.g., "Prepare app for production deployment").
    *   **Visual Cue**:
        *   🟡 **Yellow spinning circle**: It is currently running (testing your code).
        *   ✅ **Green checkmark**: Success! Your code passed all tests and is ready.
        *   ❌ **Red X**: Something failed. Click on it to see why.

---

## 🛠️ Troubleshooting

*   **"Permission denied (publickey)"**:
    *   This means GitHub doesn't recognize your computer. You may need to sign in. If using the terminal, try using GitHub Desktop (an app) instead, which handles login for you.

*   **"Authentication failed"**:
    *   Your password might be wrong. Note: GitHub uses "Personal Access Tokens" instead of passwords for the terminal now.

*   **Pipeline Fails with "Missing Secret"**:
    *   You forgot to add one of the secrets in Part 2, or you spelled the Name wrong. It must match exactly.

---

## ⚠️ Safety Warnings

1.  **NEVER Commit .env Files**:
    *   Your `.env` file contains your actual passwords. We have a `.gitignore` file that prevents this, but always be careful.
    *   **Rule of Thumb**: If you are typing a password into a file that gets uploaded to the internet, stop. Use "Secrets" instead.

2.  **Service Role Key**:
    *   The `SUPABASE_SERVICE_ROLE_KEY` is like the "Master Key" to your database. It can bypass all security rules. Never share this with anyone or post it in public chat channels.
