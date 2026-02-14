# Knowledge Base Local Setup & Testing Guide

**Status**: Starting local development setup
**Date**: February 14, 2026
**Estimated Time**: 75 minutes total

---

## Step 1: Create Supabase Development Project (15 minutes)

### Manual Steps (Must be done via web browser)

1. **Open Supabase Dashboard**
   - Go to: https://supabase.com/dashboard
   - Sign in with your account (create free account if needed)

2. **Create New Project**
   - Click "New Project" button
   - Fill in the following:
     ```
     Organization: [Your org]
     Name: voicesearch-dev
     Database Password: [Generate strong password - SAVE THIS]
     Region: [Pick closest to you]
     Pricing Plan: Free (green option)
     ```

3. **Wait for Project Creation**
   - This takes 1-2 minutes
   - You'll see "Your project is being set up..."
   - Check email for confirmation

4. **Verify Project Active**
   - Dashboard should show "voicesearch-dev" with "Active" status (green dot)
   - Left sidebar shows project name

5. **Verify SQL Editor Access**
   - In left sidebar, click "SQL Editor"
   - Verify you see "New Query" button
   - This means database is ready

---

## Step 2: Get Supabase Credentials (2 minutes)

### Collect API Keys

1. **In Supabase Dashboard**
   - Click "Settings" (gear icon) in left sidebar
   - Click "API" in submenu

2. **Copy These Values** (you'll need them in Step 3):
   - **Project URL**: Looks like `https://xxx.supabase.co`
     - Save as: `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public**: Starts with `eyJhbG...`
     - Save as: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role secret**: (optional, for future use)
     - Save as: `SUPABASE_SERVICE_KEY`

3. **Example (yours will be different)**:
   ```
   Project URL: https://abcdefghijklmnop.supabase.co
   Anon Key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

---

## Step 3: Initialize Database Schema (10 minutes)

### Deploy Tables via SQL

1. **In Supabase Dashboard**
   - Go to "SQL Editor" (left sidebar)
   - Click "New Query" button

2. **Copy Database Schema**
   - Open this file in your editor:
     ```
     supabase/migrations/001_knowledge_base_schema.sql
     ```
   - Select ALL content (Ctrl+A)
   - Copy (Ctrl+C)

3. **Run SQL in Supabase**
   - Paste into Supabase SQL Editor query window (Ctrl+V)
   - Click "Run" button (or press Ctrl+Enter)
   - Wait for execution (should take ~5 seconds)

4. **Verify Success**
   - Look for green "Success" message at bottom
   - Go to "Table Editor" (left sidebar)
   - You should see these 5 tables:
     - `knowledge_notes`
     - `note_tags`
     - `note_links`
     - `collections`
     - `collection_notes`

5. **If Error Occurs**
   - Error "already exists": Tables were created - that's fine, continue
   - Error with VECTOR: Enable pgvector extension first:
     - Settings > Database > Extensions
     - Search "vector", enable it
     - Then re-run SQL
   - Other errors: Check SQL syntax, try running in smaller chunks

### Verify Table Structure

1. **Click on `knowledge_notes` table**
   - You should see columns:
     - id (UUID)
     - user_id (UUID)
     - workspace_id (TEXT)
     - title (TEXT)
     - content (TEXT)
     - search_query (TEXT)
     - source_searches (JSONB)
     - created_at (TIMESTAMPTZ)
     - updated_at (TIMESTAMPTZ)
     - last_reviewed_at (TIMESTAMPTZ)
     - metadata (JSONB)

2. **Check other tables exist**
   - Click each table name to verify columns

---

## Step 4: Configure Environment Variables (5 minutes)

### Update .env.local

1. **Open `.env.local` in your project**
   - Location: `C:\Users\91838\Downloads\claude-autobuild-voicesearch\.env.local`

2. **Update Supabase Variables**
   - Find these lines (currently have `xxx` and `eyJhbG...`):
     ```bash
     NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbG...
     SUPABASE_SERVICE_KEY=eyJhbG...
     ```

3. **Replace with Your Values**
   - From Step 2, paste your actual values:
     ```bash
     NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
     NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     SUPABASE_SERVICE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
     ```

4. **Verify No Placeholders**
   - Search for "xxx" - should have 0 results
   - Search for "eyJhbG..." (the template) - should have 0 results
   - All keys should be complete 50+ character strings

5. **Save File**
   - Ctrl+S
   - Close file

### Important Notes

- ✅ `.env.local` is in `.gitignore` (won't be committed to git)
- ✅ These are development credentials (free tier, low risk)
- ⚠️ Never commit `.env.local` to git
- ⚠️ Never share these keys publicly
- ⚠️ For production, use Vercel's environment variable settings instead

---

## Step 5: Start Development Server (2 minutes)

### Launch Server

1. **Open Terminal**
   - In your project root directory
   - Location: `C:\Users\91838\Downloads\claude-autobuild-voicesearch`

2. **Kill Any Running Servers**
   - If you have a dev server running, stop it: `Ctrl+C`

3. **Start Fresh Server**
   ```bash
   npm run dev
   ```

4. **Wait for Ready Message**
   - You should see:
     ```
     > next dev
     ...
     ▲ Next.js 15.2.0
     ...
       ▲ Local:        http://localhost:3000
       ...
       ✓ Ready in 2.1s
     ```

5. **Open in Browser**
   - Go to: http://localhost:3000
   - You should see the VoiceSearch homepage
   - No error messages should appear

### Verify Setup

1. **Open Browser Console** (F12)
   - Click "Console" tab
   - Should see NO red error messages
   - Might see warnings about "Supabase configured" - that's expected

2. **Verify No Database Errors**
   - If you see: "Supabase not configured" - check .env.local again
   - If you see: "Failed to connect" - verify internet connection
   - If you see: "Invalid API key" - verify copied values have no spaces

---

## Step 6: End-to-End Feature Testing (30 minutes)

### Test 1: Save Search to Knowledge Base ✅

**Objective**: Verify you can save a search as a permanent note

**Steps**:
1. On homepage, type in search box: `React hooks tutorial`
2. Press Enter or click search
3. Wait for:
   - Search results to load (green progress indicators)
   - AI summary to generate
   - Related questions to appear
4. Look for **💡 Save to Knowledge** button near share button
5. Click the 💡 button

**Expected Result**:
- ✅ Green toast appears: "✨ Note saved to Knowledge Base"
- ✅ Button shows checkmark briefly
- ✅ No errors in browser console

**Troubleshooting**:
- If button doesn't appear: Check it's in top right corner, near share button
- If error "Supabase not configured": Restart dev server (Ctrl+C, npm run dev)
- If no toast: Check browser console for errors (F12 → Console tab)

**Database Verification** (Optional):
- Go to Supabase Dashboard > Table Editor > knowledge_notes
- Should see 1 new row with title "React hooks tutorial"

---

### Test 2: Open Knowledge Base ✅

**Objective**: Verify Knowledge Base UI opens and shows saved note

**Steps**:
1. Click **📚 Knowledge** button in top navigation
   - Location: Near the search bar, looks like book icon
   - OR press `Cmd+B` (Mac) / `Ctrl+B` (Windows)
   - OR press `Cmd+K` and type "Knowledge Base"

2. Knowledge Base modal should open

**Expected Result**:
- ✅ Modal titled "Knowledge Base" appears
- ✅ Shows "1 note in voicesearch" (your workspace name)
- ✅ Search box is visible at top
- ✅ "➕ New" button is visible
- ✅ Note card appears showing:
  - Title: "React hooks tutorial"
  - First 150 characters of content (preview)
  - Created date (today)

**Troubleshooting**:
- If modal doesn't open: Try pressing `Cmd+K` first, then search for "Knowledge"
- If no notes appear: Verify Test 1 saved successfully
- If empty state: Check browser console for database errors

---

### Test 3: Search Notes ✅

**Objective**: Verify full-text search works

**Steps**:
1. Keep Knowledge Base modal open
2. Type in search box: `hooks`
3. Note should remain visible (matches title)
4. Clear search, type: `xyz` (no match)
5. Note should disappear
6. Clear search box
7. Note should reappear

**Expected Result**:
- ✅ Search is case-insensitive
- ✅ Matches title AND content
- ✅ Updates in real-time (no button click needed)
- ✅ Shows "No notes found" when no matches

**Notes**:
- Search bar is live - results update as you type
- Clears automatically when you clear the box

---

### Test 4: Edit Existing Note ✅

**Objective**: Verify you can edit note content and tags

**Steps**:
1. In Knowledge Base, click on note card (React hooks tutorial)
2. Should navigate to `/knowledge/[noteId]` page
3. Modify title: Change to `React Hooks - Complete Guide`
4. Scroll down, find the editor area
5. Add to content: `## My Custom Notes\n\nThis is a test edit.`
6. Scroll to find tags section
7. Add tag: Type `react`, press Enter
8. Add tag: Type `frontend`, press Enter
9. Click **Save Note** button

**Expected Result**:
- ✅ Editor page loads with current note content
- ✅ Can modify title and content
- ✅ Tags appear as pills below title
- ✅ Save button works
- ✅ Green toast: "Note updated"
- ✅ Redirects back to Knowledge Base library
- ✅ Card shows updated title

**Troubleshooting**:
- If save doesn't work: Check console for errors
- If tags don't appear: They might be shown differently - look for tag input
- If redirects don't work: Manually navigate back to Knowledge Base (Cmd+B)

---

### Test 5: Tag Filtering ✅

**Objective**: Verify tags work and filtering works

**Steps**:
1. In Knowledge Base library (Cmd+B)
2. Look for tag filter buttons above note cards
3. You should see tag pills: "All (1)", "react (1)", "frontend (1)"
4. Click "react" tag
5. Note should still be visible
6. Click "All"
7. Note should still be visible

**Expected Result**:
- ✅ Tag pills are visible and clickable
- ✅ Active tag has different color (darker/highlighted)
- ✅ Count shows "1" next to each tag
- ✅ Filtering works correctly
- ✅ Can toggle between tags

---

### Test 6: Create New Note Manually ✅

**Objective**: Verify manual note creation works

**Steps**:
1. In Knowledge Base, click **➕ New** button
2. Navigate to `/knowledge/new` page
3. Enter title: `Test Manual Note`
4. In editor content area, enter:
   ```markdown
   # My Test Note

   This is a manually created note.

   ## Features
   - Markdown support
   - Tags
   - Search
   ```
5. Add tag: Type `test`, press Enter
6. Click **Save Note**

**Expected Result**:
- ✅ New note page opens
- ✅ Can type in title and content
- ✅ Markdown preview works (click 👁️ Preview to see)
- ✅ Green toast: "Note saved"
- ✅ Redirects to note view page
- ✅ Library now shows "2 notes" (original + new)

---

### Test 7: Delete Note ✅

**Objective**: Verify note deletion works

**Steps**:
1. In Knowledge Base library (Cmd+B)
2. Hover over "Test Manual Note" card
3. Look for **✕** button (appears on hover)
4. Click the ✕ button
5. Browser will ask: "Are you sure?"
6. Click "OK" to confirm

**Expected Result**:
- ✅ Delete button appears on hover
- ✅ Confirmation dialog shows
- ✅ Note disappears from library immediately
- ✅ Count updates to "1 note"
- ✅ Supabase table updated (check Table Editor)

**Note**: Deleted notes cannot be recovered. This is intentional.

---

### Test 8: Workspace Isolation ✅

**Objective**: Verify notes are isolated per workspace

**Steps**:
1. Click workspace dropdown (top left corner)
   - Shows current workspace name
2. Click "Create New"
3. Enter name: `Test Workspace`
4. Press Enter
5. You're now in "Test Workspace"
6. Open Knowledge Base (Cmd+B)
7. Should show "0 notes in Test Workspace" (empty)
8. Click **➕ New**
9. Create note titled: `Workspace B Note`
10. Save it
11. Go back to workspace dropdown
12. Switch back to original workspace
13. Open Knowledge Base (Cmd+B)
14. Should show original note, NOT "Workspace B Note"

**Expected Result**:
- ✅ Notes are isolated per workspace
- ✅ Switching workspaces updates note list
- ✅ No cross-contamination of notes
- ✅ Each workspace has independent knowledge base

**Note**: This verifies the `workspace_id` field in the database works correctly.

---

### Test 9: Dark Mode Compatibility ✅

**Objective**: Verify UI is readable in dark mode

**Steps**:
1. Toggle dark mode:
   - Look for moon/sun icon in top navigation
   - Click it, OR press `Cmd+/` (Ctrl+/ on Windows)
2. Open Knowledge Base (Cmd+B)
3. Visually verify readability:
   - Modal background is dark
   - Text is clearly visible
   - Note cards have proper contrast
   - Search input is readable
   - Tag pills are visible
   - Buttons are clear
4. Click on a note to edit
5. Verify editor is readable:
   - Content area is dark
   - Text is visible
   - Preview mode works

**Expected Result**:
- ✅ All text has good contrast (not gray-on-gray)
- ✅ No white backgrounds in dark mode
- ✅ Tag pills readable
- ✅ Editor is functional

---

### Test 10: Markdown Rendering ✅

**Objective**: Verify markdown syntax renders correctly

**Steps**:
1. Create a new note (Cmd+B → ➕ New)
2. Title: `Markdown Test`
3. Content: Copy this exactly:
   ```markdown
   # Heading 1
   ## Heading 2

   **Bold text** and *italic text*

   - List item 1
   - List item 2
   - Nested item

   1. Numbered item
   2. Another item

   `inline code` example

   ```javascript
   const test = 'code block';
   console.log(test);
   ```

   [Link](https://example.com)
   ```
4. Click **Preview** button (👁️ icon)
5. Verify rendering in preview pane

**Expected Result**:
- ✅ H1 is largest, H2 is smaller
- ✅ **Bold** appears bold
- ✅ *Italic* appears slanted
- ✅ Bullet lists render correctly
- ✅ Numbered lists count properly
- ✅ Inline code has gray background
- ✅ Code block has syntax highlighting
- ✅ Links are blue and clickable
- ✅ Preview updates in real-time

---

## Step 7: Performance Testing (10 minutes)

### Create Multiple Notes

1. **Create 10-15 additional notes**
   - Go to homepage
   - Search for: `React`, `JavaScript`, `TypeScript`, `Node.js`, `API design`
   - Click save (💡) after each summary
   - This builds up your note count

2. **Monitor Performance**

### Test 1: Library Load Time

**Steps**:
1. Open Knowledge Base (Cmd+B)
2. Observe how long it takes to load notes
3. With 15+ notes, should still load quickly

**Expected**: < 1 second load time

### Test 2: Search Responsiveness

**Steps**:
1. Keep Knowledge Base open
2. Type slowly in search box: `r` → `re` → `rea` → `react`
3. Watch results update in real-time
4. Should update instantly as you type

**Expected**: < 100ms response time (no lag)

### Test 3: Workspace Switching

**Steps**:
1. Have 2+ workspaces created
2. Click workspace dropdown
3. Switch between workspaces 5 times
4. Knowledge Base should update automatically

**Expected**: Smooth transitions, no loading spinner

### Monitor Browser

**In Browser Console (F12)**:
1. Check Memory tab
2. Run search tests while monitoring memory
3. Memory should not increase indefinitely
4. No memory leaks detected

---

## Step 8: Data Verification in Supabase (5 minutes)

### Verify Tables Have Data

1. **Open Supabase Dashboard**
   - Go to your project
   - Click "Table Editor"

2. **Check knowledge_notes Table**
   - Should have 15+ rows (all notes you created)
   - Click on first note to expand
   - Verify columns:
     - `title`: Shows your note titles
     - `workspace_id`: Should match your workspace
     - `content`: Contains markdown content
     - `created_at`: Shows creation date
     - `metadata`: JSONB with keyPoints, questions

3. **Check note_tags Table**
   - Should have 15+ rows (one per tag per note)
   - Each row links a note to a tag
   - Verify `note_id` references exist in knowledge_notes

4. **Run Test Query** (optional)
   - Go to SQL Editor
   - Run this query to see notes with tags:
     ```sql
     SELECT
       kn.title,
       kn.workspace_id,
       array_agg(nt.tag) as tags
     FROM knowledge_notes kn
     LEFT JOIN note_tags nt ON kn.id = nt.note_id
     GROUP BY kn.id, kn.title, kn.workspace_id
     ORDER BY kn.created_at DESC;
     ```
   - Should show all notes with their tags

### Data Integrity Checks

- ✅ No NULL titles or content
- ✅ workspace_id matches your workspaces
- ✅ created_at has valid timestamps
- ✅ Tags are linked correctly
- ✅ No orphaned notes (deleted but not cleaned)

---

## Step 9: Production Deployment Prep (15 minutes)

### Pre-Deployment Checklist

Before deploying to production, verify:

- [ ] All 10 feature tests pass
- [ ] No errors in browser console (F12)
- [ ] No errors in dev server terminal
- [ ] Performance is acceptable
- [ ] Dark mode looks good
- [ ] Data verified in Supabase

### Code Quality Checks

Run these commands in terminal:

```bash
# Production build
npm run build

# TypeScript check
npx tsc --noEmit

# Linting
npm run lint
```

All should succeed with green ✅ messages.

### Production Supabase Setup (When Ready to Deploy)

1. **Create Production Project**
   - Go to Supabase Dashboard
   - Create NEW project (name: `voicesearch-prod`)
   - Use same region as dev
   - Run same SQL schema migration
   - Copy Project URL and Anon Key

2. **Set Vercel Environment Variables** (if using Vercel)
   - Go to Vercel Dashboard > Project > Settings > Environment Variables
   - Add:
     - `NEXT_PUBLIC_SUPABASE_URL` = production URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = production key
     - `OPENAI_API_KEY` = (existing)
     - `SERPER_API_KEY` = (existing)

3. **Deploy to Production**
   ```bash
   git add .
   git commit -m "feat: Knowledge Base system with Supabase backend"
   git push origin main
   ```

4. **Verify Production**
   - Visit your production site
   - Repeat Tests 1-5 on production
   - Check Supabase production database for new notes

---

## Success Criteria

✅ **Setup Complete** when:
- Supabase project created and active
- Database schema deployed (5 tables visible)
- Environment variables configured
- Dev server runs without errors

✅ **Testing Complete** when:
- All 10 feature tests pass
- No errors in browser console
- Dark mode works
- Markdown renders correctly
- Workspace isolation verified
- Performance is acceptable

✅ **Ready for Production** when:
- All tests passing
- `npm run build` succeeds
- `npx tsc --noEmit` passes
- `npm run lint` passes
- Production Supabase project ready

---

## Troubleshooting

### Issue: "Supabase not configured" message

**Cause**: Environment variables not set or server not restarted

**Fix**:
1. Verify `.env.local` has correct values (no `xxx` placeholders)
2. Restart dev server: `Ctrl+C`, then `npm run dev`
3. Check for typos in variable names

---

### Issue: Notes not saving

**Cause**: Network error or Supabase project inactive

**Fix**:
1. Verify Supabase project is "Active" (green dot)
2. Check internet connection
3. Check browser console for specific error
4. Verify API keys copied correctly (no extra spaces)

---

### Issue: Can't delete notes

**Cause**: Row-level security (RLS) policy issue

**Fix**:
1. Check Supabase > Authentication > Policies
2. Verify "Allow all for development" policy is active
3. If not, create new policy for deletion

---

## Next Steps

1. ✅ Complete local setup (you are here)
2. Run all feature tests (30 minutes)
3. Verify performance (10 minutes)
4. Prepare for production (15 minutes)
5. Deploy to production
6. Monitor for issues

---

## Getting Help

- **Dev Server Won't Start**: Check `npm install` ran successfully
- **Database Errors**: Check Supabase project is active
- **Feature Not Working**: Check browser console (F12) for JavaScript errors
- **Build Fails**: Run `npm run lint` to find syntax errors

---

**Estimated Total Time**: ~75 minutes from start to production-ready

**Let me know when each step is complete!**
