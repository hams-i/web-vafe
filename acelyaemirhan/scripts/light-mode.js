document.querySelectorAll(".light-mode").forEach(button => {
    button.addEventListener("click", () =>{
        if(localStorage.getItem('Your_Are_My_Love_Theme') == "dark"){
            document.body.classList.remove('dark');
            document.body.classList.add('light');
            localStorage.setItem('Your_Are_My_Love_Theme', "light");
            return
        }
        if(localStorage.getItem('Your_Are_My_Love_Theme') == "light"){
            document.body.classList.remove('light');
            document.body.classList.add('dark');
            localStorage.setItem('Your_Are_My_Love_Theme', "dark");
            return
        }
    });
});


if(localStorage.getItem('Your_Are_My_Love_Theme') == null || localStorage.getItem('Your_Are_My_Love_Theme') == ''){
    localStorage.setItem('Your_Are_My_Love_Theme', 'light');
}else{
    document.body.classList.remove('dark');
    document.body.classList.remove('light');
    document.body.classList.add(localStorage.getItem('Your_Are_My_Love_Theme'));
}