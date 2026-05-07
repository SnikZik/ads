# SNIR. Client Dashboard — Setup Guide

## Architecture

```
GA4 ──────────────────────┐
                          ├──► Apps Script (doGet) ──► dashboard.html
Google Sheets ────────────┘
     ↑
     └── Shopify Flow (webhook → doPost) — auto-saves new leads
```

No Shopify API token needed. Flow is already installed on the store.

---

## Step 1 — Google Sheet setup

Create one Google Sheet with **two tabs**:

| Tab name | Purpose |
|---|---|
| `Shopify Leads` | Auto-filled by Shopify Flow webhook |
| `Facebook Leads` | Manually maintained (or from Facebook Lead Ads export) |

**Shopify Leads columns** (row 1 headers — exact spelling):
```
timestamp | name | email | tags | type
```

**Facebook Leads** — any columns you want. The dashboard shows row 1 as headers and recent rows as data.

Copy the Sheet ID from the URL:
`https://docs.google.com/spreadsheets/d/`**`THIS_PART`**`/edit`

---

## Step 2 — Apps Script setup

1. Go to [script.google.com](https://script.google.com) → New project
2. Paste the contents of `apps-script/Code.gs`
3. Edit `CONFIG` at the top:
   ```js
   var CONFIG = {
     GA4_PROPERTY_ID:     "properties/123456789",
     SPREADSHEET_ID:      "your-sheet-id",
     SHOPIFY_SHEET_NAME:  "Shopify Leads",
     FB_SHEET_NAME:       "Facebook Leads",
     DAYS_BACK: 30,
   };
   ```
4. Add GA4 service: **+** next to Services → **Google Analytics Data API** → Add
5. Deploy → **New deployment** → Web app
   - Execute as: **Me**
   - Who has access: **Anyone**
6. Copy the deployment URL — you'll need it twice (dashboard + Flow)

---

## Step 3 — Shopify Flow setup

The store has Flow installed. Set up **two flows**:

### Flow 1 — Pro Club leads

**Trigger:** Customer created
**Condition:** Customer tags contains `pro_club`
**Action:** Send HTTP request
- URL: `[your Apps Script deployment URL]`
- Method: POST
- Body (JSON):
```json
{
  "name": "{{customer.displayName}}",
  "email": "{{customer.email}}",
  "tags": "{{customer.tags}}",
  "type": "pro_club"
}
```

### Flow 2 — Newsletter leads

**Trigger:** Customer created
**Condition:** Customer tags contains `newsletter`
**Action:** Send HTTP request
- Same URL as above
- Body:
```json
{
  "name": "{{customer.displayName}}",
  "email": "{{customer.email}}",
  "tags": "{{customer.tags}}",
  "type": "newsletter"
}
```

> **Existing customers:** Flow only captures new customers going forward.
> For the existing 49 customers — export from Shopify (Customers → Export → All customers as CSV)
> and paste the relevant ones into the `Shopify Leads` sheet manually (one row per customer).

---

## Step 4 — Dashboard HTML

Open `dashboard.html` and update the `CONFIG` block:

```js
var CONFIG = {
  appsScriptUrl: "https://script.google.com/macros/s/YOUR_ID/exec",
  clientName:    "LED Club Inc.",
  currency:      "$",
  refreshMin:    10,
};
```

---

## Step 5 — Share with client

Upload `dashboard.html` to a URL or send the file directly.

---

## Per-client checklist

- [ ] Google Sheet created with two tabs (Shopify Leads + Facebook Leads)
- [ ] Shopify Leads tab has correct headers in row 1
- [ ] Apps Script deployed — GA4 Data API service added
- [ ] `SPREADSHEET_ID` and `GA4_PROPERTY_ID` filled in `Code.gs`
- [ ] Deployment URL pasted into `dashboard.html`
- [ ] Two Shopify Flows created (pro_club + newsletter)
- [ ] Tested: create a test customer in Shopify → verify row appears in Sheet
- [ ] Existing customers entered manually into Sheet
- [ ] Dashboard loads in browser — all 3 sections show data
