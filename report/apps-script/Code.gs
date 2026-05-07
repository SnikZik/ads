// ─────────────────────────────────────────────
//  SNIR. Client Dashboard — Apps Script API
//  Edit CONFIG per client, then re-deploy.
// ─────────────────────────────────────────────

var CONFIG = {
  // Google Analytics 4
  GA4_PROPERTY_ID: "properties/530503478",  // GA4 Admin → Property Settings → Property ID

  // Google Sheets (one spreadsheet, two tabs)
  SPREADSHEET_ID:      "XXXXXXXXXXXXXXXXXXXXXXXX", // Sheet ID from URL
  SHOPIFY_SHEET_NAME:  "Shopify Leads",            // tab for Shopify Flow webhooks
  FB_SHEET_NAME:       "עותק של New 29/04/26",      // tab for Facebook leads

  DAYS_BACK: 30,
};

// ─────────────────────────────────────────────
//  doGet — dashboard data endpoint
// ─────────────────────────────────────────────
function doGet(e) {
  try {
    var data = {
      ga4:      getGA4Data(),
      shopify:  getShopifyLeads(),
      facebook: getFacebookLeads(),
      updated:  new Date().toISOString(),
      config:   { daysBack: CONFIG.DAYS_BACK },
    };
    return respond(data);
  } catch (err) {
    return respond({ error: err.message });
  }
}

// ─────────────────────────────────────────────
//  doPost — Shopify Flow webhook receiver
//  Shopify Flow sends: { name, email, tags, type }
//  Deploy → Web app → Anyone can access (for Flow to reach it)
// ─────────────────────────────────────────────
function doPost(e) {
  try {
    var body = JSON.parse(e.postData.contents);
    var ss    = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    var sheet = ss.getSheetByName(CONFIG.SHOPIFY_SHEET_NAME);

    // Create tab if missing
    if (!sheet) {
      sheet = ss.insertSheet(CONFIG.SHOPIFY_SHEET_NAME);
      sheet.appendRow(["timestamp", "name", "email", "tags", "type"]);
    }

    // If first row is empty (brand new sheet), add headers
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(["timestamp", "name", "email", "tags", "type"]);
    }

    var type = (body.tags || "").indexOf("pro_club") !== -1 ? "pro_club" : "newsletter";

    sheet.appendRow([
      new Date().toISOString(),
      body.name  || "",
      body.email || "",
      body.tags  || "",
      type,
    ]);

    return respond({ ok: true });
  } catch (err) {
    return respond({ error: err.message });
  }
}

// ─────────────────────────────────────────────
//  GA4 — Sessions + traffic + ecommerce data
// ─────────────────────────────────────────────
function getGA4Data() {
  var token    = ScriptApp.getOAuthToken();
  var baseUrl  = "https://analyticsdata.googleapis.com/v1beta/" + CONFIG.GA4_PROPERTY_ID + ":runReport";
  var today    = formatDate(new Date());
  var curStart = formatDate(daysAgo(CONFIG.DAYS_BACK));
  var prevEnd  = formatDate(daysAgo(CONFIG.DAYS_BACK + 1));
  var prevStart= formatDate(daysAgo(CONFIG.DAYS_BACK * 2));

  var overviewRes = apiPost(baseUrl, {
    dateRanges: [
      { startDate: curStart,  endDate: today,   name: "current"  },
      { startDate: prevStart, endDate: prevEnd,  name: "previous" },
    ],
    metrics: [
      { name: "sessions" },
      { name: "totalUsers" },
      { name: "newUsers" },
      { name: "bounceRate" },
      { name: "averageSessionDuration" },
    ],
  }, token);

  // Ecommerce events — current period
  var ecomRes = apiPost(baseUrl, {
    dateRanges: [
      { startDate: curStart, endDate: today,  name: "current"  },
      { startDate: prevStart, endDate: prevEnd, name: "previous" },
    ],
    dimensions: [{ name: "eventName" }],
    metrics:    [{ name: "eventCount" }, { name: "purchaseRevenue" }],
    dimensionFilter: {
      filter: {
        fieldName: "eventName",
        inListFilter: { values: ["add_to_cart", "begin_checkout", "sign_up", "purchase"] },
      },
    },
  }, token);

  var sourceRes = apiPost(baseUrl, {
    dateRanges: [{ startDate: curStart, endDate: today }],
    dimensions: [{ name: "sessionDefaultChannelGroup" }],
    metrics:    [{ name: "sessions" }],
    orderBys:   [{ metric: { metricName: "sessions" }, desc: true }],
    limit: 6,
  }, token);

  var pagesRes = apiPost(baseUrl, {
    dateRanges: [{ startDate: curStart, endDate: today }],
    dimensions: [{ name: "pageTitle" }, { name: "pagePath" }],
    metrics:    [{ name: "sessions" }, { name: "screenPageViews" }],
    orderBys:   [{ metric: { metricName: "sessions" }, desc: true }],
    limit: 7,
  }, token);

  var sparkRes = apiPost(baseUrl, {
    dateRanges: [{ startDate: curStart, endDate: today }],
    dimensions: [{ name: "date" }],
    metrics:    [{ name: "sessions" }],
    orderBys:   [{ dimension: { dimensionName: "date" } }],
  }, token);

  var rows = overviewRes.rows || [];
  return {
    overview:  { current: extractMetricRow(rows, "current"), previous: extractMetricRow(rows, "previous") },
    ecommerce: formatEcommerce(ecomRes),
    sources:   formatDimMetric(sourceRes),
    pages:     formatPages(pagesRes),
    sparkline: formatSparkline(sparkRes),
  };
}

// ─────────────────────────────────────────────
//  Shopify leads — reads from Sheet (populated by Flow webhook)
// ─────────────────────────────────────────────
function getShopifyLeads() {
  try {
    var ss    = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    var sheet = ss.getSheetByName(CONFIG.SHOPIFY_SHEET_NAME);
    if (!sheet || sheet.getLastRow() < 2) {
      return { pro: { total: 0, newMonth: 0, recent: [] }, newsletter: { total: 0, newMonth: 0 } };
    }

    var data    = sheet.getDataRange().getValues();
    var headers = data[0]; // timestamp, name, email, tags, type
    var rows    = data.slice(1);
    var monthStart = getMonthStart();

    var pro  = rows.filter(function (r) { return r[4] === "pro_club"; });
    var news = rows.filter(function (r) { return r[4] === "newsletter"; });

    function newThisMonth(arr) {
      return arr.filter(function (r) { return r[0] >= monthStart; }).length;
    }

    function recentRows(arr) {
      return arr.slice(-5).reverse().map(function (r) {
        return { name: r[1], email: r[2], date: String(r[0]).slice(0, 10) };
      });
    }

    return {
      pro: {
        total:    pro.length,
        newMonth: newThisMonth(pro),
        recent:   recentRows(pro),
      },
      newsletter: {
        total:    news.length,
        newMonth: newThisMonth(news),
      },
    };
  } catch (e) {
    return { error: e.message, pro: { total: 0, newMonth: 0, recent: [] }, newsletter: { total: 0, newMonth: 0 } };
  }
}

// ─────────────────────────────────────────────
//  Facebook leads — reads from Sheet
// ─────────────────────────────────────────────
function getFacebookLeads() {
  try {
    var ss    = SpreadsheetApp.openById(CONFIG.SPREADSHEET_ID);
    var sheet = ss.getSheetByName(CONFIG.FB_SHEET_NAME) || ss.getSheets()[0];
    var data  = sheet.getDataRange().getValues();
    if (!data || data.length < 2) return { total: 0, rows: [], headers: [] };

    var headers = data[0].map(String);
    var rows    = [];
    for (var i = 1; i < data.length; i++) {
      var row = {}, hasData = false;
      for (var j = 0; j < headers.length; j++) {
        row[headers[j]] = data[i][j];
        if (data[i][j] !== "") hasData = true;
      }
      if (hasData) rows.push(row);
    }
    return { total: rows.length, recent: rows.slice(-5).reverse(), headers: headers, rows: rows };
  } catch (e) {
    return { error: e.message, total: 0, rows: [], headers: [] };
  }
}

// ─────────────────────────────────────────────
//  Helpers
// ─────────────────────────────────────────────
function respond(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function apiPost(url, body, token) {
  var res = UrlFetchApp.fetch(url, {
    method: "POST", contentType: "application/json",
    headers: { Authorization: "Bearer " + token },
    payload: JSON.stringify(body), muteHttpExceptions: true,
  });
  return JSON.parse(res.getContentText());
}

function extractMetricRow(rows, name) {
  for (var i = 0; i < rows.length; i++) {
    var dv = rows[i].dimensionValues;
    if (dv && dv[0] && dv[0].value === name) {
      var mv = rows[i].metricValues;
      return {
        sessions: safeNum(mv,0), totalUsers: safeNum(mv,1), newUsers: safeNum(mv,2),
        bounceRate: safeFloat(mv,3), avgSessionDuration: safeFloat(mv,4),
      };
    }
  }
  return {};
}

function formatEcommerce(res) {
  var events = ["add_to_cart", "begin_checkout", "sign_up", "purchase"];
  var cur = {}, prev = {};
  (res.rows || []).forEach(function(r) {
    var name    = r.dimensionValues[0].value;
    var period  = r.dimensionValues[1] ? r.dimensionValues[1].value : "current";
    var count   = parseInt(r.metricValues[0].value, 10) || 0;
    var revenue = parseFloat(r.metricValues[1].value) || 0;
    if (period === "current")  { cur[name]  = { count: count, revenue: revenue }; }
    if (period === "previous") { prev[name] = { count: count, revenue: revenue }; }
  });
  // Handle case where API returns rows without dateRange dimension (single period)
  // When two dateRanges are used, GA4 adds a dateRange dimension automatically
  // If it doesn't (old API behavior), fall back gracefully
  return {
    addToCart:      { current: (cur["add_to_cart"]    || {}).count   || 0, previous: (prev["add_to_cart"]    || {}).count   || 0 },
    beginCheckout:  { current: (cur["begin_checkout"] || {}).count   || 0, previous: (prev["begin_checkout"] || {}).count   || 0 },
    signUp:         { current: (cur["sign_up"]        || {}).count   || 0, previous: (prev["sign_up"]        || {}).count   || 0 },
    purchases:      { current: (cur["purchase"]       || {}).count   || 0, previous: (prev["purchase"]       || {}).count   || 0 },
    revenue:        { current: (cur["purchase"]       || {}).revenue || 0, previous: (prev["purchase"]       || {}).revenue || 0 },
  };
}

function formatDimMetric(res) {
  var rows  = res.rows || [];
  var total = rows.reduce(function(s,r){ return s+(parseInt(r.metricValues[0].value,10)||0); }, 0);
  return rows.map(function(r) {
    var v = parseInt(r.metricValues[0].value,10)||0;
    return { label: r.dimensionValues[0].value, value: v, pct: total>0?Math.round(v/total*100):0 };
  });
}

function formatPages(res) {
  return (res.rows||[]).map(function(r) {
    return { title: r.dimensionValues[0].value, path: r.dimensionValues[1].value,
             sessions: parseInt(r.metricValues[0].value,10)||0, views: parseInt(r.metricValues[1].value,10)||0 };
  });
}

function formatSparkline(res) {
  var dates=[], sessions=[];
  (res.rows||[]).forEach(function(r) {
    var d = r.dimensionValues[0].value;
    dates.push(d.slice(4,6)+"/"+d.slice(6,8));
    sessions.push(parseInt(r.metricValues[0].value,10)||0);
  });
  return { dates:dates, sessions:sessions };
}

function getMonthStart() {
  var d = new Date(); return new Date(d.getFullYear(), d.getMonth(), 1);
}

function safeNum(arr,idx)   { return arr&&arr[idx]?(parseInt(arr[idx].value,10)||0):0; }
function safeFloat(arr,idx) { return arr&&arr[idx]?(parseFloat(arr[idx].value)||0):0; }
function daysAgo(n)         { var d=new Date(); d.setDate(d.getDate()-n); return d; }
function formatDate(d) {
  return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
}
