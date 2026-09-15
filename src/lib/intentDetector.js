export const detectIntent = (question) => {
  const q = question.toLowerCase();

  // =====================================================
  // Active Tickets
  // =====================================================

  if (
    q.includes("تیکت فعال") ||
    q.includes("تیکت‌های فعال") ||
    q.includes("تیکت های فعال")
  ) {
    return {
      entity: "activeTickets",
      operation: "count",
    };
  }

  // =====================================================
  // Description
  // =====================================================

  if (
    q.includes("چه چیزی را نشان") ||
    q.includes("چی را نشان") ||
    q.includes("درباره چیست") ||
    q.includes("چی هست") ||
    q.includes("چه چیزی است") ||
    q.includes("این نمودار چیست") ||
    q.includes("این چارت چیست") ||
    q.includes("این بخش چیست") ||
    q.includes("توضیح بده")
  ) {
    return {
      entity: null,
      operation: "description",
    };
  }

  // =====================================================
  // Asset specific questions
  // =====================================================

  if (
    q.includes("بیشترین دارایی") ||
    q.includes("بیشترین گروه دارایی")
  ) {
    return {
      entity: "assets",
      operation: "assetGroupMaximum",
    };
  }

  if (
    q.includes("کمترین دارایی") ||
    q.includes("کمترین گروه دارایی")
  ) {
    return {
      entity: "assets",
      operation: "assetGroupMinimum",
    };
  }

  // =====================================================
  // Comparison
  // =====================================================

  if (
    q.includes("بهترین") ||
    q.includes("بدترین") ||
    q.includes("مقایسه")
  ) {
    return {
      entity: null,
      operation: "comparison",
    };
  }

  // =====================================================
  // Anomaly
  // =====================================================

  if (
    q.includes("غیرعادی") ||
    q.includes("غیر عادی") ||
    q.includes("مشکوک") ||
    q.includes("انحراف")
  ) {
    return {
      entity: null,
      operation: "anomaly",
    };
  }

  // =====================================================
  // Forecast
  // =====================================================

  if (
    q.includes("پیش‌بینی") ||
    q.includes("پیش بینی") ||
    q.includes("ماه بعد") ||
    q.includes("دوره بعد") ||
    q.includes("آینده")
  ) {
    return {
      entity: null,
      operation: "forecast",
    };
  }

  // =====================================================
  // Maximum
  // =====================================================

  if (
    q.includes("بیشترین") ||
    q.includes("حداکثر")
  ) {
    return {
      entity: null,
      operation: "maximum",
    };
  }

  // =====================================================
  // Minimum
  // =====================================================

  if (
    q.includes("کمترین") ||
    q.includes("حداقل")
  ) {
    return {
      entity: null,
      operation: "minimum",
    };
  }

  // =====================================================
  // Average
  // =====================================================

  if (q.includes("میانگین")) {
    return {
      entity: null,
      operation: "average",
    };
  }

  // =====================================================
  // Growth
  // =====================================================

  if (q.includes("رشد")) {
    return {
      entity: null,
      operation: "growth",
    };
  }

  // =====================================================
  // Trend
  // =====================================================

  if (
    q.includes("روند") ||
    q.includes("افزایشی") ||
    q.includes("افزایش") ||
    q.includes("نزولی") ||
    q.includes("کاهش")
  ) {
    return {
      entity: null,
      operation: "trend",
    };
  }

  // =====================================================
  // Cause
  // =====================================================

  if (
    q.includes("چرا") ||
    q.includes("علت") ||
    q.includes("دلیل")
  ) {
    return {
      entity: null,
      operation: "cause",
    };
  }

  // =====================================================
  // Summary / Report / KPI
  // =====================================================

  if (
    q.includes("خلاصه") ||
    q.includes("گزارش") ||
    q.includes("شاخص کلیدی") ||
    q.includes("شاخص‌های کلیدی") ||
    q.includes("شاخص های کلیدی") ||
    q.includes("kpi") ||
    q.includes("نکات مهم") ||
    q.includes("مهم‌ترین نکات") ||
    q.includes("مهمترین نکات") ||
    q.includes("وضعیت") ||
    q.includes("چطوره") ||
    q.includes("چطور است") ||
    q.includes("ارزیابی") ||
    q.includes("برای مدیر") ||
    q.includes("وضعیت کلی")
  ) {
    return {
      entity: null,
      operation: "summary",
    };
  }

  // =====================================================
  // Tickets
  // =====================================================

  if (q.includes("تیکت")) {
    return {
      entity: "tickets",
      operation: "summary",
    };
  }

  // =====================================================
  // Projects
  // =====================================================

  if (q.includes("پروژه")) {
    return {
      entity: "projects",
      operation: "count",
    };
  }

  // =====================================================
  // Assets
  // =====================================================

  if (q.includes("دارایی")) {
    return {
      entity: "assets",
      operation: "count",
    };
  }

  // =====================================================
  // Employees
  // =====================================================

  if (q.includes("کارمند")) {
    return {
      entity: "employees",
      operation: "count",
    };
  }

  // =====================================================
  // Insights
  // =====================================================

  if (
    q.includes("درمورد این نمودار") ||
    q.includes("در مورد این نمودار") ||
    q.includes("نکته مهم") ||
    q.includes("بینش") ||
    q.includes("چه نکته")
  ) {
    return {
      entity: null,
      operation: "insights",
    };
  }

  // =====================================================
  // Unknown
  // =====================================================

  return {
    entity: null,
    operation: "unknown",
  };
};