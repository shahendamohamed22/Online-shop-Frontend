
export function validateRequired(value, fieldLabel) {
  if (!value || !value.toString().trim()) {
    return `${fieldLabel} مطلوب`;
  }
  return "";
}

export function validateEmail(value) {
  if (!value || !value.trim()) return "الإيميل مطلوب";
  if (!/\S+@\S+\.\S+/.test(value)) return "صيغة الإيميل غير صحيحة";
  return "";
}

export function validatePhone(value) {
  if (!value || !value.trim()) return "رقم التليفون مطلوب";
  if (!/^01[0-9]{9}$/.test(value)) return "رقم التليفون غير صحيح (لازم يبدأ بـ 01 و11 رقم)";
  return "";
}

export function validatePassword(value) {
  if (!value) return "كلمة السر مطلوبة";
  if (value.length < 8) return "كلمة السر لازم تكون 8 حروف على الأقل";
  if (!/[A-Z]/.test(value)) return "كلمة السر لازم تحتوي على حرف كبير";
  if (!/[0-9]/.test(value)) return "كلمة السر لازم تحتوي على رقم";
  return "";
}

export function validateConfirmPassword(password, confirmPassword) {
  if (password !== confirmPassword) return "كلمة السر وتأكيدها مش متطابقين";
  return "";
}

export function validateSelect(value, fieldLabel) {
  if (!value) return `${fieldLabel} مطلوب`;
  return "";
}