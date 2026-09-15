import OpenAI from "openai";

import { dashboardData } from "@/data/dashboardData";
import { detectIntent } from "@/lib/intentDetector";
import { aiTools } from "@/lib/aiTools";

const MODEL = "inclusionai/ling-3.0-flash-vl:free";

const client = new OpenAI({
  apiKey: process.env.OPENROUTER_API_KEY,
  baseURL: "https://openrouter.ai/api/v1",
});

// =====================================================
// دریافت Dataset مناسب از داشبورد
// =====================================================

const getDashboardDataset = (entity, section) => {
  if (entity === "assets" && section === "asset-chart") {
    return dashboardData.assetsByGroup;
  }

  if (entity === "assets" && section === "assets-by-month") {
    return dashboardData.assetsByMonth;
  }

  if (
    entity === "tickets" &&
    ["tickets-by-month", "bar-chart", "line-chart"].includes(section)
  ) {
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
// توضیح بخش‌های داشبورد
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
    // دریافت داده خام داشبورد
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
      const { entity, section, operation } = args;

      // -----------------------------------------------
      // KPIهای عددی
      // -----------------------------------------------

      if (entity === "employees") {
        return {
          entity,
          section: "kpi",
          operation,
          result: dashboardData.employees,
        };
      }

      if (entity === "projects") {
        return {
          entity,
          section: "kpi",
          operation,
          result: dashboardData.projects,
        };
      }

      if (entity === "activeTickets") {
        return {
          entity,
          section: "kpi",
          operation,
          result: dashboardData.activeTickets,
        };
      }

      // -----------------------------------------------
      // دریافت Dataset
      // -----------------------------------------------

      const data = getDashboardDataset(entity, section);

      if (!Array.isArray(data) || data.length === 0) {
        return {
          error: "داده مورد نظر پیدا نشد.",
        };
      }

      // -----------------------------------------------
      // بیشترین مقدار
      // -----------------------------------------------

      if (operation === "maximum") {
        const maximum = data.reduce((max, item) =>
          item.value > max.value ? item : max,
        );

        return {
          entity,
          section,
          operation,
          result: maximum,
        };
      }

      // -----------------------------------------------
      // کمترین مقدار
      // -----------------------------------------------

      if (operation === "minimum") {
        const minimum = data.reduce((min, item) =>
          item.value < min.value ? item : min,
        );

        return {
          entity,
          section,
          operation,
          result: minimum,
        };
      }

      // -----------------------------------------------
      // میانگین
      // -----------------------------------------------

      if (operation === "average") {
        const total = data.reduce((sum, item) => sum + item.value, 0);

        const average = total / data.length;

        return {
          entity,
          section,
          operation,
          result: Number(average.toFixed(2)),
        };
      }

      // -----------------------------------------------
      // رشد
      // -----------------------------------------------

      if (operation === "growth") {
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
          entity,
          section,
          operation,
          result: Number(growth.toFixed(2)),
        };
      }

      // -----------------------------------------------
      // روند
      // -----------------------------------------------

      if (operation === "trend") {
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
        } else if (last < first) {
          direction = "down";
          label = "نزولی";
        }

        return {
          entity,
          section,
          operation,
          result: {
            direction,
            label,
          },
        };
      }

      // -----------------------------------------------
      // ناهنجاری
      // -----------------------------------------------

      if (operation === "anomaly") {
        const average =
          data.reduce((sum, item) => sum + item.value, 0) / data.length;

        const anomalies = data.filter((item) => {
          const deviation = Math.abs(item.value - average);

          return deviation > average * 0.5;
        });

        return {
          entity,
          section,
          operation,
          result: anomalies,
        };
      }

      // -----------------------------------------------
      // پیش‌بینی
      // -----------------------------------------------

      if (operation === "forecast") {
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

        const sumX2 = x.reduce(
          (sum, value) => sum + value * value,
          0,
        );

        const denominator = n * sumX2 - sumX * sumX;

        if (denominator === 0) {
          return {
            error: "امکان محاسبه پیش‌بینی وجود ندارد.",
          };
        }

        const slope =
          (n * sumXY - sumX * sumY) / denominator;

        const intercept =
          (sumY - slope * sumX) / n;

        const nextX = n + 1;

        const prediction =
          slope * nextX + intercept;

        return {
          entity,
          section,
          operation,
          result: {
            value: Math.round(prediction),
            slope: Number(slope.toFixed(4)),
          },
        };
      }

      // -----------------------------------------------
      // خلاصه آماری
      // -----------------------------------------------

      if (operation === "summary") {
        const total = data.reduce(
          (sum, item) => sum + item.value,
          0,
        );

        const average = total / data.length;

        const maximum = data.reduce((max, item) =>
          item.value > max.value ? item : max,
        );

        const minimum = data.reduce((min, item) =>
          item.value < min.value ? item : min,
        );

        return {
          entity,
          section,
          operation,
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
      const description = getSectionDescription(
        args.entity,
        args.section,
      );

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

    // -------------------------------------------------
    // آخرین پیام کاربر
    // -------------------------------------------------

    const lastMessage = messages[messages.length - 1];

    if (!lastMessage?.content) {
      return Response.json({
        answer: "پیامی برای پردازش دریافت نشد.",
      });
    }

    const question = lastMessage.content.toLowerCase();

    // =================================================
    // Insights
    // =================================================

    if (
      question.includes("مهم‌ترین نکات") ||
      question.includes("مهمترین نکات") ||
      question.includes("نکات مهم") ||
      question.includes("بینش") ||
      question.includes("مهم‌ترین بینش") ||
      question.includes("مهمترین بینش")
    ) {
      const overview = {
        employees: dashboardData.employees,
        projects: dashboardData.projects,
        activeTickets: dashboardData.activeTickets,
        assetsByMonth: dashboardData.assetsByMonth,
        ticketsByMonth: dashboardData.ticketsByMonth,
        assetsByGroup: dashboardData.assetsByGroup,
      };

      const insightCompletion =
        await client.chat.completions.create({
          model: MODEL,

          messages: [
            {
              role: "system",

              content: `
تو دستیار داشبورد مدیریتی هستی.

فقط و فقط از داده‌های زیر استفاده کن.
هیچ داده، شاخص یا موجودیت دیگری اختراع نکن.

داده‌های مجاز:

- کارکنان
- پروژه‌ها
- تیکت‌های فعال
- تیکت‌های ماهانه
- دارایی‌های ماهانه
- گروه‌های دارایی

هرگز درباره فروش، درآمد، هزینه، مشتری، محصول یا دپارتمان صحبت نکن؛
چون این داده‌ها در داشبورد وجود ندارند.

سه تا پنج نکته مهم و قابل توجه از داده‌ها را به فارسی بیان کن.

اگر داده‌ای برای یک نتیجه کافی نیست، آن نتیجه را بیان نکن.

پاسخ کوتاه و مدیریتی باشد.

عددها را با رقم فارسی بنویس.
`,
            },

            {
              role: "user",

              content: `
سؤال:

${lastMessage.content}

داده‌های واقعی داشبورد:

${JSON.stringify(overview, null, 2)}
`,
            },
          ],

          tool_choice: "none",
        });

      const insightAnswer =
        insightCompletion?.choices?.[0]?.message?.content ||
        "اطلاعات کافی برای استخراج نکات مهم وجود ندارد.";

      return Response.json({
        answer: insightAnswer,
      });
    }

    // =================================================
    // Description Intent
    // =================================================

    const intent = detectIntent(lastMessage.content);

    if (intent.operation === "description") {
      const entity =
        dashboardContext?.selectedEntity ||
        intent.entity ||
        "assets";

      const section =
        dashboardContext?.selectedSection ||
        "asset-chart";

      const description = getSectionDescription(
        entity,
        section,
      );

      if (description) {
        return Response.json({
          answer: description,
        });
      }

      return Response.json({
        answer:
          "اطلاعات کافی برای توضیح این بخش وجود ندارد.",
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

=====================================================
انتخاب Operation
=====================================================

عملیات قابل انجام توسط analyze_data:

- maximum
- minimum
- average
- growth
- trend
- anomaly
- forecast
- summary

=====================================================
قوانین دارایی‌ها
=====================================================

اگر سؤال درباره گروه یا نوع دارایی باشد:

→ entity: assets
→ section: asset-chart

اگر سؤال درباره ماه‌ها یا تغییرات ماهانه دارایی‌ها باشد:

→ entity: assets
→ section: assets-by-month

مثال:

«بیشترین دارایی کدام است؟»

→ assets + asset-chart + maximum

«کمترین دارایی کدام است؟»

→ assets + asset-chart + minimum

«میانگین دارایی‌ها چقدر است؟»

→ assets + asset-chart + average

«دارایی‌ها در چه ماهی بیشترین مقدار را داشتند؟»

→ assets + assets-by-month + maximum

«روند دارایی‌ها چگونه است؟»

→ assets + assets-by-month + trend

«دارایی‌ها چقدر رشد کرده‌اند؟»

→ assets + assets-by-month + growth

«تعداد دارایی‌ها در ماه بعد چقدر خواهد بود؟»

→ assets + assets-by-month + forecast

=====================================================
قوانین تیکت‌ها
=====================================================

برای سؤال‌هایی که درباره تعداد یا تغییرات تیکت‌ها در ماه‌های مختلف هستند:

→ entity: tickets
→ section: tickets-by-month

مثال:

«بیشترین تیکت در چه ماهی بوده؟»

→ tickets + tickets-by-month + maximum

«کمترین تیکت در چه ماهی بوده؟»

→ tickets + tickets-by-month + minimum

«میانگین تیکت‌ها چقدر است؟»

→ tickets + tickets-by-month + average

«روند تیکت‌ها چگونه است؟»

→ tickets + tickets-by-month + trend

«تعداد تیکت‌ها چقدر رشد کرده؟»

→ tickets + tickets-by-month + growth

«ماه بعد چند تیکت خواهیم داشت؟»

→ tickets + tickets-by-month + forecast

=====================================================
قوانین KPI
=====================================================

اگر کاربر درباره تعداد کارکنان، پروژه‌ها یا تیکت‌های فعال سؤال کرد، از KPI مربوطه استفاده کن.

مثال:

«چند کارمند داریم؟»

→ employees

«چند پروژه داریم؟»

→ projects

«چند تیکت فعال داریم؟»

→ activeTickets

برای KPIهایی که فقط یک مقدار عددی دارند، عملیات maximum، minimum، average، growth، trend و forecast را روی آن‌ها اجرا نکن؛ مگر اینکه داده مناسب دیگری در داشبورد وجود داشته باشد.

=====================================================
سؤال‌های ترکیبی
=====================================================

اگر کاربر چند تحلیل را همزمان درخواست کرد، برای هر تحلیل یک Tool Call جداگانه ایجاد کن.

مثال:

«وضعیت دارایی‌ها را بررسی کن و بیشترین، کمترین، میانگین و روند دارایی‌ها را بگو.»

باید چهار Tool Call ایجاد شود:

1. assets + asset-chart + maximum
2. assets + asset-chart + minimum
3. assets + asset-chart + average
4. assets + assets-by-month + trend

تمام Tool Callهای مستقل را در صورت امکان همزمان ایجاد کن.

=====================================================
قانون مهم Dataset
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
- اگر چند نتیجه وجود دارد، آن‌ها را مرتب و خوانا ارائه کن.
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

    const completion =
      await client.chat.completions.create({
        model: MODEL,

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

    const assistantMessage =
      completion?.choices?.[0]?.message;

    const toolCalls =
      assistantMessage?.tool_calls || [];

    // =================================================
    // اجرای Toolها
    // =================================================

    if (toolCalls.length > 0) {
      const toolMessages = [];

      for (const toolCall of toolCalls) {
        const toolName = toolCall.function.name;

        let toolArgs;

        try {
          toolArgs = JSON.parse(
            toolCall.function.arguments,
          );
        } catch {
          toolMessages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            content: JSON.stringify({
              error:
                "پارامترهای Tool قابل پردازش نیستند.",
            }),
          });

          continue;
        }

        const toolResult = executeTool(
          toolName,
          toolArgs,
        );

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

      const finalCompletion =
        await client.chat.completions.create({
          model: MODEL,

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

      return Response.json({
        answer: finalAnswer,
      });
    }

    // =================================================
    // اگر Tool Call انجام نشد
    // =================================================

    const fallbackAnswer =
      assistantMessage?.content ||
      "اطلاعات کافی برای پاسخ وجود ندارد.";

    return Response.json({
      answer: fallbackAnswer,
    });
  } catch (error) {
    console.error("API ERROR:", error);

    // -------------------------------------------------
    // OpenRouter Rate Limit
    // -------------------------------------------------

    if (error?.status === 429) {
      return Response.json(
        {
          error:
            "سهمیه استفاده از مدل هوش مصنوعی به پایان رسیده است.",
        },
        {
          status: 429,
        },
      );
    }

    // -------------------------------------------------
    // سایر خطاها
    // -------------------------------------------------

    return Response.json(
      {
        error:
          error?.message ||
          "خطایی در پردازش درخواست رخ داد.",
      },
      {
        status: 500,
      },
    );
  }
}