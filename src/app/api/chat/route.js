import OpenAI from "openai";

import { dashboardData } from "@/data/dashboardData";
import { detectIntent } from "@/lib/intentDetector";
import { aiTools } from "@/lib/aiTools";


console.log(
  "OPENROUTER_API_KEY:",
  process.env.OPENROUTER_API_KEY
    ? `exists (${process.env.OPENROUTER_API_KEY.length} chars)`
    : "MISSING"
);

const testResponse = await fetch(
  "https://openrouter.ai/api/v1/chat/completions",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: "inclusionai/ling-3.0-flash-vl:free",
      messages: [
        {
          role: "user",
          content: "Say hello",
        },
      ],
    }),
  }
);

console.log(
  "DIRECT FETCH STATUS:",
  testResponse.status
);

console.log(
  "DIRECT FETCH RESPONSE:",
  await testResponse.text()
);

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});
console.log(
  "OPENROUTER_API_KEY exists:",
  !!process.env.OPENROUTER_API_KEY
);

// =====================================================
// دریافت داده مناسب از داشبورد
// =====================================================

const getDashboardDataset = (entity, section) => {
  if (entity === "assets") {
    if (section === "asset-chart") {
      return dashboardData.assetsByGroup;
    }

    return dashboardData.assetsByMonth;
  }

  if (entity === "tickets") {
    return dashboardData.ticketsByMonth;
  }

  if (entity === "employees") {
    return dashboardData.employees;
  }

  if (entity === "projects") {
    return dashboardData.projects;
  }

  if (entity === "activeTickets") {
    return dashboardData.activeTickets;
  }

  return null;
};

// =====================================================
// توضیح بخش داشبورد
// =====================================================

const getSectionDescription = (entity, section) => {
  if (entity === "assets" && section === "asset-chart") {
    return "این نمودار توزیع دارایی‌ها بر اساس گروه را نشان می‌دهد.";
  }

  if (entity === "tickets" && section === "ticket-list") {
    return "این بخش فهرست تیکت‌های فعال را نشان می‌دهد.";
  }

  if (entity === "tickets" && section === "bar-chart") {
    return "این نمودار اطلاعات مربوط به تیکت‌ها را در ماه‌های مختلف نشان می‌دهد.";
  }

  if (entity === "tickets" && section === "line-chart") {
    return "این نمودار روند تغییرات تیکت‌ها در ماه‌های مختلف را نشان می‌دهد.";
  }

  return null;
};

// =====================================================
// اجرای Tool
// =====================================================

const executeTool = (name, args) => {
  switch (name) {
    // -------------------------------------------------
    // دریافت داده داشبورد
    // -------------------------------------------------

    case "get_dashboard_data": {
      const data = getDashboardDataset(args.entity, args.section);

      if (data === null || data === undefined) {
        return {
          error: "داده مورد نظر پیدا نشد.",
        };
      }

      return {
        entity: args.entity,
        section: args.section || null,
        data,
      };
    }

    // -------------------------------------------------
    // تحلیل داده
    // -------------------------------------------------

    case "analyze_data": {
      let data;

      // -------------------------------------------------
      // انتخاب Dataset
      // -------------------------------------------------

      if (args.entity === "assets") {
        if (args.section === "asset-chart") {
          data = dashboardData.assetsByGroup;
        } else if (args.section === "assets-by-month") {
          data = dashboardData.assetsByMonth;
        }
      }

      if (args.entity === "tickets") {
        if (
          args.section === "tickets-by-month" ||
          args.section === "bar-chart" ||
          args.section === "line-chart"
        ) {
          data = dashboardData.ticketsByMonth;
        }
      }

      // -------------------------------------------------
      // KPIها
      // -------------------------------------------------

      if (args.entity === "employees") {
        return {
          entity: "employees",
          section: "kpi",
          operation: args.operation,
          result: dashboardData.employees,
        };
      }

      if (args.entity === "projects") {
        return {
          entity: "projects",
          section: "kpi",
          operation: args.operation,
          result: dashboardData.projects,
        };
      }

      if (args.entity === "activeTickets") {
        return {
          entity: "activeTickets",
          section: "kpi",
          operation: args.operation,
          result: dashboardData.activeTickets,
        };
      }

      // -------------------------------------------------
      // بررسی وجود Dataset
      // -------------------------------------------------

      if (!data || !Array.isArray(data) || data.length === 0) {
        return {
          error: "داده مورد نظر پیدا نشد.",
        };
      }

      // -------------------------------------------------
      // بیشترین
      // -------------------------------------------------

      if (args.operation === "maximum") {
        const maximum = data.reduce((max, item) =>
          item.value > max.value ? item : max,
        );

        return {
          entity: args.entity,
          section: args.section,
          operation: "maximum",
          result: maximum,
        };
      }

      // -------------------------------------------------
      // کمترین
      // -------------------------------------------------

      if (args.operation === "minimum") {
        const minimum = data.reduce((min, item) =>
          item.value < min.value ? item : min,
        );

        return {
          entity: args.entity,
          section: args.section,
          operation: "minimum",
          result: minimum,
        };
      }

      // -------------------------------------------------
      // میانگین
      // -------------------------------------------------

      if (args.operation === "average") {
        const total = data.reduce((sum, item) => sum + item.value, 0);

        const average = total / data.length;

        return {
          entity: args.entity,
          section: args.section,
          operation: "average",
          result: Number(average.toFixed(2)),
        };
      }

      // -------------------------------------------------
      // رشد
      // -------------------------------------------------

      if (args.operation === "growth") {
        if (data.length < 2) {
          return {
            error: "داده کافی برای محاسبه رشد وجود ندارد.",
          };
        }

        const first = data[0].value;
        const last = data[data.length - 1].value;

        if (first === 0) {
          return {
            error: "محاسبه رشد از مقدار اولیه صفر امکان‌پذیر نیست.",
          };
        }

        const growth = ((last - first) / first) * 100;

        return {
          entity: args.entity,
          section: args.section,
          operation: "growth",
          result: Number(growth.toFixed(2)),
        };
      }

      // -------------------------------------------------
      // روند
      // -------------------------------------------------

      if (args.operation === "trend") {
        if (data.length < 2) {
          return {
            error: "داده کافی برای تحلیل روند وجود ندارد.",
          };
        }

        const first = data[0].value;
        const last = data[data.length - 1].value;

        let direction = "stable";
        let label = "ثابت";

        if (last > first) {
          direction = "up";
          label = "صعودی";
        }

        if (last < first) {
          direction = "down";
          label = "نزولی";
        }

        return {
          entity: args.entity,
          section: args.section,
          operation: "trend",
          result: {
            direction,
            label,
          },
        };
      }

      // -------------------------------------------------
      // ناهنجاری
      // -------------------------------------------------

      if (args.operation === "anomaly") {
        const average =
          data.reduce((sum, item) => sum + item.value, 0) / data.length;

        const anomalies = data.filter((item) => {
          const deviation = Math.abs(item.value - average);

          return deviation > average * 0.5;
        });

        return {
          entity: args.entity,
          section: args.section,
          operation: "anomaly",
          result: anomalies,
        };
      }

      // -------------------------------------------------
      // پیش‌بینی
      // -------------------------------------------------

      if (args.operation === "forecast") {
        if (data.length < 2) {
          return {
            error: "داده کافی برای پیش‌بینی وجود ندارد.",
          };
        }

        const n = data.length;

        const x = data.map((_, index) => index + 1);

        const y = data.map((item) => item.value);

        const sumX = x.reduce((sum, value) => sum + value, 0);

        const sumY = y.reduce((sum, value) => sum + value, 0);

        const sumXY = x.reduce(
          (sum, value, index) => sum + value * y[index],
          0,
        );

        const sumX2 = x.reduce((sum, value) => sum + value * value, 0);

        const denominator = n * sumX2 - sumX * sumX;

        if (denominator === 0) {
          return {
            error: "امکان محاسبه پیش‌بینی وجود ندارد.",
          };
        }

        const slope = (n * sumXY - sumX * sumY) / denominator;

        const intercept = (sumY - slope * sumX) / n;

        const nextX = n + 1;

        const prediction = slope * nextX + intercept;

        return {
          entity: args.entity,
          section: args.section,
          operation: "forecast",
          result: {
            value: Math.round(prediction),
            slope: Number(slope.toFixed(4)),
          },
        };
      }

      // -------------------------------------------------
      // خلاصه
      // -------------------------------------------------

      if (args.operation === "summary") {
        const total = data.reduce((sum, item) => sum + item.value, 0);

        const average = total / data.length;

        const maximum = data.reduce((max, item) =>
          item.value > max.value ? item : max,
        );

        const minimum = data.reduce((min, item) =>
          item.value < min.value ? item : min,
        );

        return {
          entity: args.entity,
          section: args.section,
          operation: "summary",
          result: {
            total,
            average: Number(average.toFixed(2)),
            maximum,
            minimum,
          },
        };
      }

      return {
        error: "این نوع تحلیل هنوز پیاده‌سازی نشده است.",
      };
    }

    // -------------------------------------------------
    // توضیح نمودار
    // -------------------------------------------------

    case "describe_dashboard_section": {
      const description = getSectionDescription(args.entity, args.section);

      if (!description) {
        return {
          error: "توضیحی برای این بخش وجود ندارد.",
        };
      }

      return {
        entity: args.entity,
        section: args.section,
        description,
      };
    }

    // -------------------------------------------------
    // Tool ناشناخته
    // -------------------------------------------------

    default:
      return {
        error: "ابزار مورد نظر وجود ندارد.",
      };
  }
};

// =====================================================
// POST
// =====================================================

export async function POST(request) {
  try {
    // -------------------------------------------------
    // دریافت اطلاعات
    // -------------------------------------------------

    const body = await request.json();

    const messages = body.messages || [];

    const dashboardContext = body.dashboardContext || {};

    console.log("DASHBOARD CONTEXT:", dashboardContext);

    console.log("MESSAGES FROM CLIENT:", messages);

    // -------------------------------------------------
    // آخرین پیام کاربر
    // -------------------------------------------------

    const lastMessage = messages[messages.length - 1];

    if (!lastMessage?.content) {
      return Response.json({
        answer: "پیامی برای پردازش دریافت نشد.",
      });
    }

    console.log("USER QUESTION:", lastMessage.content);

    // =================================================
    // فقط برای description
    // Intent قدیمی فعلاً اینجا باقی می‌ماند
    // =================================================

    const intent = detectIntent(lastMessage.content);

    console.log("DESCRIPTION INTENT:", intent);

    if (intent.operation === "description") {
      const entity =
        dashboardContext?.selectedEntity || intent.entity || "assets";

      const section = dashboardContext?.selectedSection || "asset-chart";

      const description = getSectionDescription(entity, section);

      if (description) {
        return Response.json({
          answer: description,
        });
      }

      return Response.json({
        answer: "اطلاعات کافی برای توضیح این بخش وجود ندارد.",
      });
    }

    // =================================================
    // System Prompt
    // =================================================

    const systemPrompt = `
تو دستیار هوشمند یک داشبورد مدیریتی هستی.

وظیفه تو این است که ابتدا سؤال کاربر را تحلیل کنی و در صورت نیاز مناسب‌ترین ابزار، Dataset و operation را انتخاب کنی.

=====================================================
قوانین کلی
=====================================================

- برای سؤال‌های تحلیلی از analyze_data استفاده کن.
- برای تحلیل داده‌ها از get_dashboard_data استفاده نکن.
- اگر سؤال درباره بیشترین، کمترین، میانگین، رشد، روند، ناهنجاری، پیش‌بینی یا خلاصه آماری است، مستقیماً analyze_data را انتخاب کن.
- اگر سؤال فقط درباره داده خام داشبورد است، از get_dashboard_data استفاده کن.
- اگر کاربر درباره معنی، کاربرد یا توضیح یک نمودار سؤال کرد، از describe_dashboard_section استفاده کن.
- اگر سؤال شامل چند تحلیل است، برای هر تحلیل یک Tool Call جداگانه ایجاد کن.
- خودت محاسبات عددی را انجام نده؛ محاسبه باید توسط JavaScript و Tool انجام شود.
- فقط بر اساس نتیجه Toolها پاسخ بده.
- اطلاعاتی که در داده‌ها وجود ندارد نساز.
- درباره Toolها، API، مدل هوش مصنوعی یا جزئیات فنی با کاربر صحبت نکن.
- پاسخ نهایی کوتاه، طبیعی و روان باشد.
- پاسخ نهایی فارسی باشد.
- عددها را با رقم فارسی بنویس.

=====================================================
انتخاب Dataset
=====================================================

دارایی‌ها:

- asset-chart
  برای توزیع دارایی‌ها بر اساس گروه یا نوع دارایی.

- assets-by-month
  برای تغییرات و مقایسه دارایی‌ها در ماه‌های مختلف.

تیکت‌ها:

- tickets-by-month
  برای تعداد تیکت‌ها در ماه‌های مختلف.

- bar-chart
  برای داده‌های ماهانه تیکت‌ها در نمودار میله‌ای.

- line-chart
  برای روند ماهانه تیکت‌ها در نمودار خطی.

KPIها:

- employees
  تعداد کارکنان.

- projects
  تعداد پروژه‌ها.

- activeTickets
  تعداد تیکت‌های فعال.

انتخاب operation

=====================================================

عملیات قابل انجام توسط analyze_data:

- maximum
  برای پیدا کردن بیشترین مقدار.

- minimum
  برای پیدا کردن کمترین مقدار.

- average
  برای محاسبه میانگین.

- growth
  برای محاسبه درصد رشد بین اولین و آخرین مقدار داده.

- trend
  برای تشخیص روند کلی داده‌ها.

- anomaly
  برای پیدا کردن مقادیر غیرعادی.

- forecast
  برای پیش‌بینی مقدار دوره بعد بر اساس داده‌های قبلی.

- summary
  برای ارائه خلاصه آماری شامل مجموع، میانگین، بیشترین و کمترین مقدار.

=====================================================

قوانین پیش‌بینی

=====================================================

اگر کاربر از عباراتی مانند:

- پیش‌بینی
- ماه بعد
- دوره بعد
- مقدار بعدی
- چقدر خواهد شد
- چه تعداد خواهیم داشت
- در آینده چقدر خواهد بود

استفاده کرد و سؤال درباره داده‌های ماهانه بود، از operation برابر forecast استفاده کن.

برای دارایی‌ها:

→ entity: assets
→ section: assets-by-month
→ operation: forecast

برای تیکت‌ها:

→ entity: tickets
→ section: tickets-by-month
→ operation: forecast

Forecast فقط باید برای داده‌های دارای چند مقدار تاریخی استفاده شود.

برای KPIهایی مانند employees، projects و activeTickets که فقط یک مقدار دارند، forecast را اجرا نکن.
  =====================================================
قوانین انتخاب داده برای دارایی‌ها
=====================================================

اگر سؤال درباره گروه یا نوع دارایی باشد:

→ assets + asset-chart

اگر سؤال درباره ماه‌ها یا تغییرات ماهانه دارایی‌ها باشد:

→ assets + assets-by-month

مثال:

«بیشترین دارایی کدام است؟»

→ analyze_data
→ entity: assets
→ section: asset-chart
→ operation: maximum


«کمترین دارایی کدام است؟»

→ analyze_data
→ entity: assets
→ section: asset-chart
→ operation: minimum


«میانگین دارایی‌ها چقدر است؟»

→ analyze_data
→ entity: assets
→ section: asset-chart
→ operation: average


«دارایی‌ها در چه ماهی بیشترین مقدار را داشتند؟»

→ analyze_data
→ entity: assets
→ section: assets-by-month
→ operation: maximum


«روند دارایی‌ها چگونه است؟»

→ analyze_data
→ entity: assets
→ section: assets-by-month
→ operation: trend


«دارایی‌ها چقدر رشد کرده‌اند؟»

→ analyze_data
→ entity: assets
→ section: assets-by-month
→ operation: growth

«تعداد دارایی‌ها در ماه بعد چقدر خواهد بود؟»

→ analyze_data
→ entity: assets
→ section: assets-by-month
→ operation: forecast


«دارایی‌ها را برای ماه بعد پیش‌بینی کن.»

→ analyze_data
→ entity: assets
→ section: assets-by-month
→ operation: forecast


«پیش‌بینی دارایی‌ها چیست؟»

→ analyze_data
→ entity: assets
→ section: assets-by-month
→ operation: forecast
=====================================================
قوانین انتخاب داده برای تیکت‌ها
=====================================================

برای سؤال‌هایی که درباره تعداد یا تغییرات تیکت‌ها در ماه‌های مختلف هستند:

→ entity: tickets
→ section: tickets-by-month

مثال:

«بیشترین تیکت در چه ماهی بوده؟»

→ analyze_data
→ entity: tickets
→ section: tickets-by-month
→ operation: maximum


«کمترین تیکت در چه ماهی بوده؟»

→ analyze_data
→ entity: tickets
→ section: tickets-by-month
→ operation: minimum


«میانگین تیکت‌ها چقدر است؟»

→ analyze_data
→ entity: tickets
→ section: tickets-by-month
→ operation: average


«روند تیکت‌ها چگونه است؟»

→ analyze_data
→ entity: tickets
→ section: tickets-by-month
→ operation: trend


«تعداد تیکت‌ها چقدر رشد کرده؟»

→ analyze_data
→ entity: tickets
→ section: tickets-by-month
→ operation: growth

«ماه بعد چند تیکت خواهیم داشت؟»

→ analyze_data
→ entity: tickets
→ section: tickets-by-month
→ operation: forecast


«تعداد تیکت‌ها را پیش‌بینی کن.»

→ analyze_data
→ entity: tickets
→ section: tickets-by-month
→ operation: forecast


«پیش‌بینی تیکت‌ها چیست؟»

→ analyze_data
→ entity: tickets
→ section: tickets-by-month
→ operation: forecast
=====================================================
سؤال‌های مربوط به KPI
=====================================================

اگر کاربر درباره تعداد کارکنان، پروژه‌ها یا تیکت‌های فعال سؤال کرد، از داده KPI مربوطه استفاده کن.

مثال:

«چند کارمند داریم؟»

→ entity: employees


«چند پروژه داریم؟»

→ entity: projects


«چند تیکت فعال داریم؟»

→ entity: activeTickets

برای KPIهایی که فقط یک مقدار عددی دارند، عملیات maximum، minimum، average، growth، trend و forecast را روی آن‌ها اجرا نکن؛ مگر اینکه داده مناسب دیگری در داشبورد وجود داشته باشد.

=====================================================
سؤال‌های ترکیبی
=====================================================

اگر کاربر چند تحلیل را همزمان درخواست کرد، برای هر تحلیل یک Tool Call جداگانه ایجاد کن.

مثال:

«وضعیت دارایی‌ها را بررسی کن و بیشترین، کمترین، میانگین و روند دارایی‌ها را بگو.»

باید چهار Tool Call ایجاد شود:

1. analyze_data
   assets + asset-chart + maximum

2. analyze_data
   assets + asset-chart + minimum

3. analyze_data
   assets + asset-chart + average

4. analyze_data
   assets + assets-by-month + trend

تمام Tool Callهای مستقل را در صورت امکان همزمان ایجاد کن.

=====================================================
قانون مهم درباره انتخاب Dataset
=====================================================

به تفاوت بین «بیشترین دارایی» و «بیشترین دارایی در ماه» دقت کن.

«بیشترین دارایی کدام است؟»

یعنی مقایسه گروه‌های دارایی:

→ asset-chart

«دارایی‌ها در چه ماهی بیشترین مقدار را داشتند؟»

یعنی مقایسه ماه‌ها:

→ assets-by-month

همین منطق را برای تیکت‌ها نیز رعایت کن.

=====================================================
پاسخ نهایی
=====================================================

بعد از دریافت نتایج Toolها:

- فقط بر اساس نتایج واقعی Toolها پاسخ بده.
- همه نتایج مرتبط با سؤال را در پاسخ نهایی بیاور.
- اگر چند نتیجه وجود دارد، آن‌ها را به صورت مرتب و خوانا ارائه کن.
- از توضیحات اضافی خودداری کن.
- محاسبات جدید انجام نده.
- اطلاعات جدید نساز.
- نام Toolها را به کاربر نشان نده.
- درباره فرآیند داخلی یا مدل هوش مصنوعی صحبت نکن.
- پاسخ نهایی فقط نتیجه تحلیل باشد.
`;

    // =================================================
    // User Prompt
    // =================================================

    const userPrompt = `
سؤال کاربر:

${lastMessage.content}

اطلاعات بخش انتخاب‌شده در داشبورد:

${JSON.stringify(dashboardContext, null, 2)}
`;

    // =================================================
    // AI - مرحله اول
    // انتخاب Tool
    // =================================================

    console.log("REACHED AI");

    const completion = await client.chat.completions.create({
      model: "inclusionai/ling-3.0-flash-vl:free",

      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: userPrompt,
        },
      ],

      tools: aiTools.map((tool) => ({
        type: "function",
        function: tool,
      })),

      tool_choice: "required",
    });

    const assistantMessage = completion?.choices?.[0]?.message;

    console.log(
      "FULL ASSISTANT MESSAGE:",
      JSON.stringify(assistantMessage, null, 2),
    );

    console.log(
      "MESSAGE TOOL CALLS:",
      JSON.stringify(assistantMessage?.tool_calls, null, 2),
    );

    const toolCalls = assistantMessage?.tool_calls || [];

    // =================================================
    // اگر AI ابزار انتخاب کرد
    // =================================================

    if (toolCalls.length > 0) {
      const toolMessages = [];

      for (const toolCall of toolCalls) {
        const toolName = toolCall.function.name;

        let toolArgs;

        try {
          toolArgs = JSON.parse(toolCall.function.arguments);
        } catch (error) {
          console.error("TOOL ARGUMENT PARSE ERROR:", error);

          toolMessages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            content: JSON.stringify({
              error: "پارامترهای Tool قابل پردازش نیستند.",
            }),
          });

          continue;
        }

        console.log("TOOL NAME:", toolName);

        console.log("TOOL ARGS:", toolArgs);

        // ---------------------------------------------
        // اجرای واقعی Tool توسط JavaScript
        // ---------------------------------------------

        const toolResult = executeTool(toolName, toolArgs);

        console.log("TOOL RESULT:", toolResult);

        // ---------------------------------------------
        // ارسال نتیجه Tool به AI
        // ---------------------------------------------

        toolMessages.push({
          role: "tool",
          tool_call_id: toolCall.id,
          content: JSON.stringify(toolResult),
        });
      }

      // =================================================
      // AI - مرحله دوم
      // تولید پاسخ نهایی
      // =================================================

      console.log("REACHED FINAL AI");

      const finalCompletion = await client.chat.completions.create({
        model: "inclusionai/ling-3.0-flash-vl:free",

        messages: [
          {
            role: "system",
            content: `
تو پاسخ نهایی دستیار داشبورد هستی.

بر اساس نتیجه ابزارها پاسخ بده.

قوانین:

- فقط اطلاعات موجود در نتایج ابزارها را استفاده کن.
- اطلاعات جدید نساز.
- پاسخ کوتاه و طبیعی باشد.
- فارسی پاسخ بده.
- عددها را با رقم فارسی بنویس.
- درباره Tool یا هوش مصنوعی صحبت نکن.
- اگر چند نتیجه وجود دارد، همه را در یک پاسخ منظم ارائه کن.
`,
          },

          {
            role: "user",
            content: lastMessage.content,
          },

          assistantMessage,

          ...toolMessages,
        ],

        tool_choice: "none",
      });

      const finalAnswer =
        finalCompletion?.choices?.[0]?.message?.content ||
        "اطلاعات کافی برای پاسخ وجود ندارد.";

      console.log("FINAL AI ANSWER:", finalAnswer);

      return Response.json({
        answer: finalAnswer,
      });
    }

    // =================================================
    // اگر Tool Call انجام نشد
    // =================================================

    const fallbackAnswer =
      assistantMessage?.content || "اطلاعات کافی برای پاسخ وجود ندارد.";

    console.log("FALLBACK AI ANSWER:", fallbackAnswer);

    return Response.json({
      answer: fallbackAnswer,
    });
  } catch (error) {
    console.error("API ERROR:", error);

    return Response.json(
      {
        error: error.message,
      },
      {
        status: 500,
      },
    );
  }
}
