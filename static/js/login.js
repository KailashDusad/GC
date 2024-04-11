const urlParams = new URLSearchParams(window.location.search);
        const type = urlParams.get('type')
        if (type) {
          let toast = document.querySelector(".toast");
          let progress = document.querySelector(".progress") ;
          let timer1, timer2;
          toast.style.display = "block";
          toast.classList.add("active");
          progress.classList.add("active");
    
          timer1 = setTimeout(() => {
            toast.style.display = "none";
          }, 500000); 
        }