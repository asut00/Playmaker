import { REDIRECT_URL } from "../../utils/Spotify";


// window.location = 'http://localhost:3000/#/App' + window.location.hash;

function MatchAllRoute(){

    console.log(window.location.hash.split(''));

    const correctURL = () => {
        if(window.location.hash.split('')[1] !== '/') {
            window.location = 'http://localhost:3000/#/App' + window.location.hash;
        }
    };

    return correctURL();


    const handleCorrectClick = () => {
        return correctURL();
    }





    return (
        <div>
            <p>You're in the wrong place !</p>
            <button onClick={handleCorrectClick}> CORRECT URL </button>
        </div>
    )
}




/*

console.log('the type of window location is ' + typeof window.location);
// window.location = 'https://www.google.fr/'
console.log(window.location.hash.split(''))



if window.location.hash.length > 1) {
    window.location = REDIRECT_URL + window.location.hash
    
}
*/ 

export default MatchAllRoute;