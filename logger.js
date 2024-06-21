import winston, { format } from 'winston'

// Create a custom log format for better readability
const customFormat = format.printf(
  ({ level, message, timestamp, ...metadata }) => {
    let msg = `${timestamp} [${level}] : ${message} `
    if (metadata) {
      msg += JSON.stringify(metadata)
    }
    return msg
  },
)

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info', // يمكن التحكم بمستوى التسجيل من خلال متغير البيئة LOG_LEVEL
  format: format.combine(
    format.colorize(), // إضافة ألوان لسهولة القراءة في الكونسول
    format.timestamp(),
    customFormat,
  ),
  transports: [
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error', // تسجيل الأخطاء فقط
      maxsize: 5242880, // 5MB // تعيين حجم أقصى لملف السجل
      maxFiles: 5, // الاحتفاظ ب 5 ملفات سجل كحد أقصى
      tailable: true, // يسمح بمتابعة الملف أثناء الكتابة إليه
    }),
    new winston.transports.File({ filename: 'logs/combined.log' }), // جميع أنواع السجلات
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log' }), // سجل خاص بالاستثناءات غير المعالجة
  ],
  exitOnError: false, // عدم إيقاف التطبيق في حال حدوث خطأ في التسجيل
})

// Log to console if not in production
if (process.env.ENVIRONMENT !== 'production') {
  logger.add(new winston.transports.Console())
}

// دالة مساعدة لإنشاء logger جديد بنفس الإعدادات
logger.createChildLogger = (serviceName) => {
  return logger.child({ service: serviceName })
}

export default logger
