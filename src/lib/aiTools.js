export const aiTools = [
  {
    name: "get_dashboard_data",
    description:
      "فقط زمانی از این ابزار استفاده کن که برای پاسخ به سؤال واقعاً به داده خام داشبورد نیاز داری. اگر سؤال کاربر درباره محاسبه یا تحلیل آماری مانند بیشترین، کمترین، میانگین، رشد، روند، ناهنجاری یا پیش‌بینی است، از این ابزار استفاده نکن و مستقیماً analyze_data را صدا بزن.",
    parameters: {
      type: "object",
      properties: {
        entity: {
          type: "string",
          enum: ["tickets", "assets", "employees", "projects", "activeTickets"],
          description: "بخش مورد نظر داشبورد",
        },
        section: {
          type: "string",
          description: "بخش یا نمودار خاص مورد نظر کاربر، در صورت وجود",
        },
      },
      required: ["entity"],
    },
  },

  {
    name: "analyze_data",
    description: `ابزار اصلی تحلیل داده‌های داشبورد است.

برای هر سؤال تحلیلی مستقیماً از این ابزار استفاده کن و نیازی به get_dashboard_data نیست.

عملیات قابل انجام:
- maximum: بیشترین مقدار
- minimum: کمترین مقدار
- average: میانگین
- growth: درصد رشد
- trend: روند کلی
- anomaly: مقادیر غیرعادی
- forecast: پیش‌بینی مقدار بعدی
- summary: خلاصه آماری

برای دارایی‌ها:
- asset-chart = توزیع دارایی‌ها بر اساس گروه یا نوع دارایی
- assets-by-month = تغییرات دارایی‌ها در ماه‌های مختلف

بنابراین:
- «بیشترین دارایی کدام است؟» → asset-chart + maximum
- «کمترین دارایی کدام است؟» → asset-chart + minimum
- «میانگین دارایی‌ها چقدر است؟» → asset-chart + average
- «دارایی‌ها در چه ماهی بیشترین مقدار را داشتند؟» → assets-by-month + maximum
- «روند دارایی‌ها چگونه است؟» → assets-by-month + trend

اگر کاربر چند تحلیل را همزمان درخواست کرد، برای هر تحلیل یک analyze_data جداگانه فراخوانی کن.`,
    parameters: {
      type: "object",
      properties: {
        entity: {
          type: "string",
          enum: ["tickets", "assets", "employees", "projects", "activeTickets"],
          description: "بخش مورد نظر داشبورد",
        },
        section: {
          type: "string",
          enum: [
            "asset-chart",
            "assets-by-month",
            "tickets-by-month",
            "bar-chart",
            "line-chart",
          ],
          description: "منبع داده مناسب برای تحلیل را انتخاب کن.",
        },
        operation: {
  type: "string",
  enum: [
    "summary",
    "maximum",
    "minimum",
    "average",
    "growth",
    "trend",
    "anomaly",
    "forecast",
  ],
  description:
    "نوع تحلیل مورد نیاز کاربر",
},
      },
      required: ["entity", "section", "operation"],
    },
  },

  {
    name: "describe_dashboard_section",
    description:
      "برای توضیح یک نمودار یا بخش داشبورد استفاده می‌شود. وقتی کاربر می‌پرسد این نمودار چیست، چه چیزی نشان می‌دهد یا درباره این نمودار توضیح بده، از این ابزار استفاده کن.",
    parameters: {
      type: "object",
      properties: {
        entity: {
          type: "string",
          enum: ["assets", "tickets"],
        },
        section: {
          type: "string",
          enum: ["asset-chart", "ticket-list", "bar-chart", "line-chart"],
        },
      },
      required: ["entity", "section"],
    },
  },
];
