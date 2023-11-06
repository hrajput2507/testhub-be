import { Sequelize, DataTypes } from "sequelize";
import db_config from "../../config/database.js";
import user_staff from "./users/user_staff.js";
import exam from "./exams/exam.js";
import exam_category from "./exams/exam_category.js";
import exam_content from "./exams/exam_content.js";
import blog from "./blogs/blog.js";
import blog_category from "./blogs/blog_category.js";
import blog_topic from "./blogs/blog_topic.js";
import user_teacher from "./users/user_teacher.js";
import academy from "./academy/academy.js";
import test_series from "./series/test_series.js";
import test from "./series/test.js";
import exam_subject from "./exams/exam_subject.js";
import exam_subject_relation from "./exams/exam_subject_relation.js";
import question from "./series/question.js";
import faq from "./settings/faq.js";
import user_student from "./users/user_student.js";
import student_preferences from "./student/student_preferences.js";
import student_tests from "./student/student_tests.js";
import lead_teachers from "./leads/lead_teachers.js";
import contact from "./users/contact.js";
import cart from "./cart/cart.js";


const sequelize = new Sequelize(
  db_config.DB,
  db_config.USER,
  db_config.PASSWORD,
  {
    host: db_config.HOST,
    logging: db_config.LOGGING,
    dialect: "mysql",
    pool: {
      max: 10000,
      min: 0,
      acquire: 60000,
      idle: 1000,
    },

    define: {
      underscored: true,
      freezeTableName: true,
      timestamps: true,
    },
  }
);

sequelize
  .authenticate()
  .then(() => {
    console.log(`DB connected to [${db_config.HOST}]`);
  })
  .catch((err) => {
    console.log("Error" + err);
  });

const db_connection = {};

db_connection.Sequelize = Sequelize;
db_connection.sequelize = sequelize;

/* User Models */
db_connection.user_staff_model = user_staff(sequelize, DataTypes);
db_connection.user_teacher_model = user_teacher(sequelize, DataTypes);
db_connection.user_student_model = user_student(sequelize, DataTypes);

/* Exam and Subject Models */
db_connection.subjects_model = exam_subject(sequelize, DataTypes);
db_connection.esr_model = exam_subject_relation(sequelize, DataTypes);
db_connection.exams_model = exam(sequelize, DataTypes);
db_connection.exam_category_model = exam_category(sequelize, DataTypes);
db_connection.exam_content_model = exam_content(sequelize, DataTypes);

/* Blog Models */
db_connection.blog_model = blog(sequelize, DataTypes);
db_connection.blog_category_model = blog_category(sequelize, DataTypes);
db_connection.blog_topic_model = blog_topic(sequelize, DataTypes);

/* Academy Model */
db_connection.academy_model = academy(sequelize, DataTypes);

/* Test Series Models */
db_connection.test_series_model = test_series(sequelize, DataTypes);
db_connection.test_model = test(sequelize, DataTypes);
db_connection.question_model = question(sequelize, DataTypes);

/* Setting Models */
db_connection.faq_model = faq(sequelize, DataTypes);

/* Student Models */
db_connection.student_tests_model = student_tests(sequelize, DataTypes);
db_connection.student_preferences_model = student_preferences(
  sequelize,
  DataTypes
);

/* Leads Models */
db_connection.lead_teachers_model = lead_teachers(sequelize, DataTypes);

/* Contact Models */
db_connection.contact_model = contact(sequelize, DataTypes);

/* Contact Models */
db_connection.cart_model = cart(sequelize, DataTypes);

db_connection.sequelize.sync({ alter: true }).then(() => {
  console.log("re-sync done!");
});

export default db_connection;
