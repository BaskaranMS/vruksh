const app = require("./app");
const config = require("./config/config");

// const PORT = process.env.PORT || 3000;
const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
