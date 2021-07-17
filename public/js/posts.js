posts = document.querySelectorAll(".download-btn");
posts.forEach(function (post) {
  post.addEventListener("click", (e) => {
    let the = e.target.parentElement.getAttribute("data-id");
    axios
      .get(`/get-file?id=${the}`)
      .then(function (response) {
        console.log(response);
      })
      .catch(function (err) {
        console.error("download failed !!!");
        console.error(err);
      });
  });
});
