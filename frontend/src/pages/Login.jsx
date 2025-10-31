import './Login.css';

function Login() {
    
    return(
        <div>
            <div className="title">
                <p className = "header">ALISTAR VS GURAU</p>
                <p className = "text-header">Voteaza-ti preferatul</p>
            </div>

            <div className="images">
              <img src='../../Assets/Images/Ilinca.png' alt="Gurau" className="gurau-image" />
               <img src='../../Assets/Images/Gurau.jpg' alt="Alistar" className="alistar-image" />              <img src='../../Assets/Images/Ilinca.png' alt="Gurau" className="gurau-image" />
               <img src='../../Assets/Images/Gurau.jpg' alt="Alistar" className="alistar-image" />              <img src='../../Assets/Images/Ilinca.png' alt="Gurau" className="gurau-image" />
               <img src='../../Assets/Images/Gurau.jpg' alt="Alistar" className="alistar-image" />              <img src='../../Assets/Images/Ilinca.png' alt="Gurau" className="gurau-image" />
               <img src='../../Assets/Images/Gurau.jpg' alt="Alistar" className="alistar-image" />              <img src='../../Assets/Images/Ilinca.png' alt="Gurau" className="gurau-image" />
               <img src='../../Assets/Images/Gurau.jpg' alt="Alistar" className="alistar-image" />              <img src='../../Assets/Images/Ilinca.png' alt="Gurau" className="gurau-image" />
               <img src='../../Assets/Images/Gurau.jpg' alt="Alistar" className="alistar-image" />
            </div>

            <div className="input-group">
                
                <form className="input-textbox">
                <input type="text" placeholder="Username"/>
                <input type="email" placeholder="Email"/>
                <input type="password" placeholder="Password"/> 
                </form>

                <button className="Button">Login</button>
            </div>
        </div>
    )
}


export default Login;