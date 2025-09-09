
const SUPABASE_URL = "https://qitewsgbwhvayhhlcqud.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFpdGV3c2did2h2YXloaGxjcXVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwNTM2NTIsImV4cCI6MjA3MjYyOTY1Mn0.zeBbI8MENQTrkxzwG4GKXvHQ8SOUt4qBDxsSCw7iBEU";

const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

document.getElementById("asdf").addEventListener("click", async () => {
  const { data, error } = await supabaseClient
    .from("Argha")
    .select("*")

  if (error) {
    console.error("Failed to fetch:", error);
    return;
  }

  // Create an array from the rows
  const myArray = data.map((row) => ({
    id: row.id,
    description: row.des,
    location: row.loc,
    url: row.img_url,
  }));

  console.log("Array created:", myArray);


  if (myArray.length > 0) {
    console.log("First item description:", myArray[0].description);
  }
});


// let { data: cleaning_req, error } = await supabase
//   .from('cleaning_req')
//   .select('*')