// 🔹 Replace with YOUR values from Supabase Project Settings → API
const SUPABASE_URL = "https://yzqdwwwefnuqrwvarjua.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl6cWR3d3dlZm51cXJ3dmFyanVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTY5ODczMDQsImV4cCI6MjA3MjU2MzMwNH0.wdNJ3Xmaqv1gCI1bE2F0GGUrA0COjlmLDKe3HW4LHk8";

const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_ANON_KEY
);

// Upload handler
document.getElementById("register_button").addEventListener("click", async (e) => {
  e.preventDefault();


  let x = document.getElementsByClassName("input2")

  const name = x[0].value;
  const email = x[1].value;
  const password = x[2].value;
  console.log(name, email, password)

  // Save into table "test"
  const { error: insertError } = await supabaseClient
    .from("Agency")
    .insert([{ UserName: name, Email: email, PassWord: password }]);

  if (insertError) {
    alert(" Failed to save record!");
    console.error(insertError);
  } else {
    alert(" Success! Saved to Supabase.");
  }
});

// Fetch names
document.getElementById("login_btn").addEventListener("click", async () => {
  const { data, error } = await supabaseClient
    .from("Agency")
    .select("*")

  if (error) {
    alert(" Failed to fetch names!");
    console.error(error);
    return;
  }

  const y = document.getElementsByClassName("input1")
  let fetch_name = y[0]
  let fetch_password = y[1]


  data.forEach((row) => {
    if (fetch_name.value == row.UserName && fetch_password.value == row.PassWord) {
      window.location = "/html-folder/govt.html"
    } else if (fetch_name.value != row.UserName) {
      error_txt.innerHTML = `**Enter a valid username`
    } else {
      error_txt.innerHTML = `**Enter a valid passsword`
    }
    // console.log(row.Email, row.UserName, row.PassWord) 
  });
});
