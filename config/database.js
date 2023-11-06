let db_config = {};

// Hostinger db credentails
db_config = {
  HOST: "16.16.180.234",
  USER: "root",
  PASSWORD: "root",
  DB: "testkart_dev",
  LOGGING: false,
};
// db_config = {
//   HOST: "217.21.91.1",
//   USER: "u889430799_testkart_dev",
//   PASSWORD: "Zgh;1bkQq:a3",
//   DB: "u889430799_testkart_dev",
//   LOGGING: false,
// };

if (process.argv[2] === "local") {
  // local db credentails
  db_config = {
    HOST: "localhost",
    USER: "root",
    PASSWORD: "Main4itl123",
    DB: "test_kart",
    LOGGING: false,
  };
}

if (process.argv[3] === "ankit") {
  // personal laptop db credentails
  db_config = {
    HOST: "localhost",
    USER: "ankit",
    PASSWORD: "Asd123!@#",
    DB: "test_kart",
    LOGGING: false,
  };
}

if (process.argv[4] === "arun") {
  // personal laptop db credentails
  db_config = {
    HOST: "127.0.0.1",
    USER: "root",
    PASSWORD: "root",
    DB: "testkart",
    LOGGING: false,
  };
}

export default db_config;
