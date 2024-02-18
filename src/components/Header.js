import React, { useEffect, useState } from "react";
// import Categories from "./Categories";
import { toggleMenu } from "../redux/menuToggleSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { SEARCH_API } from "../utils/constants.js";
import { cacheSuggestions } from "../redux/searchSlice";
import hamBurgerIcon from '../assets/hamburger.svg';
import logo from '../assets/logo.svg';
import bellIcon from '../assets/bell.svg';
import mikeIcon from '../assets/mike.svg';
import createIcon from '../assets/create.svg';
import { useNavigate } from "react-router-dom";


const Header = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const searchCache = useSelector((store) => store.cache);

  useEffect(() => {
   if(searchQuery!== ""){
      const timer = setTimeout(() => {
        if (searchCache[searchQuery]) {
          setSuggestions(searchCache[searchQuery]);
        } else {
          getSuggestions();
        }
      }, 200);
      return () => {
        clearTimeout(timer);
      };
   }

  }, [searchQuery]);

//   const getSuggestions = async () => {
//    // Define the CORS Anywhere proxy URL
//    const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
   
//    // Prepend the proxy URL to the original SEARCH_API endpoint
//    await fetch(`${CORS_PROXY}${SEARCH_API}${searchQuery}`, {
//      method: 'GET', // Optionally specify the method
//      headers: {
//        'X-Requested-With': 'XMLHttpRequest' // Some instances of CORS Anywhere require this header
//      }
//    })
//    .then((data) => data.json())
//    .then((response) => {
//      setSuggestions(response[1]);
//      console.log(response);
//      dispatch(cacheSuggestions({
//        [searchQuery]: response[1],
//      }))
//    })
//    .catch((error) => {
//      console.error('Error fetching the suggestions:', error);
//    });
//  };

function jsonp(url, callback) {
   let callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
   window[callbackName] = function(data) {
     delete window[callbackName];
     document.body.removeChild(script);
     callback(data);
   };
 
   let script = document.createElement('script');
   script.src = `${url}&callback=${callbackName}`;
   document.body.appendChild(script);
 }
 
 const getSuggestions = () => {
   const url = `${SEARCH_API}${searchQuery}`; // Make sure the API supports JSONP and expects a callback parameter
   jsonp(url, (response) => {
     setSuggestions(response[1]);
     console.log(response);
     dispatch(cacheSuggestions({
       [searchQuery]: response[1],
     }));
   });
 };
 
 

//   const getSuggestions = async () => {
//     await fetch(SEARCH_API + searchQuery)
//       .then((data) => data.json())
//       .then((response) => {
//         setSuggestions(response[1]);
//         console.log(response);
//         dispatch(cacheSuggestions({
//           [searchQuery] : response[1],
//         }))
//       });
//   };

  const handleSuggestion = (event) => {
    setSearchQuery(event.target.innerText);
    setShowSuggestions(false);
    navigate('/results?search_query=' + encodeURI(event.target.innerText));
 }

 const handleSubmit = (e) => {
   e.preventDefault()
   setShowSuggestions(false);
   navigate('/results?search_query=' + encodeURI(searchQuery));
 }

  const toggleMenuHandler = () => {
    dispatch(toggleMenu());
  };
  return (

    <div className="fixed top-0 left-0 right-0 z-50 bg-white">
        <div className="flex flex-row justify-between items-center px-4 py-3">
            <div className="flex flex-row items-center">
                <div className="w-10 h-10 hover:rounded-full hover:bg-gray-100 cursor-pointer">
                    <img className="h-6 mt-2 ml-2" onClick={toggleMenuHandler} src={hamBurgerIcon} alt="hamBurgerIcon" />
                </div>
                <a href="/"><img src={logo} className="w-30 h-10" alt="" /></a>
            </div>
            <div className="relative">
            <div className='flex flex-row relative'>
                  <form className="flex" onSubmit={handleSubmit}>
                  <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onFocus={() => setShowSuggestions(true)} onBlur={() => setShowSuggestions(false)} className='border rounded-l-full w-[572px] h-10 pl-5 outline-none' type='text' placeholder='Search' />
                  <button type="submit" className='border rounded-r-full w-16 h-10 bg-gray-100'>
                     <img alt='search-icon' className='h-5 mx-auto' src='https://cdn-icons-png.flaticon.com/512/482/482631.png' />
                     </button>

                  </form>

                  <div className='w-10 h-10 hover:rounded-full hover:bg-gray-100 ml-5 cursor-pointer'>
                     <img className='mt-2 ml-2' alt='mick-icon ' src={mikeIcon} />
                  </div>
                  {searchQuery && <button onClick={() => setSearchQuery("")} className='absolute hover:bg-gray-200 hover:rounded-full w-9 h-9 right-[8.2rem] top-[2px]'>X</button>}
               </div>
               {
                  (showSuggestions && suggestions?.length > 0) &&
                  <div className='absolute bg-white w-[560px] max-h-[400px] shadow-lg border rounded-lg overflow-y-auto left-3 top-10 z-50 text-left'>
                     <ul className='py-3'>
                        {
                           suggestions?.map((sugg) =>
                              <li key={sugg} onMouseDown={(e) => handleSuggestion(e)} className='my-1 p-1 hover:bg-gray-100 cursor-pointer'>
                                 <img  className='mr-5 h-4 ml-3 inline-block' alt='search-icon' src='https://cdn-icons-png.flaticon.com/512/482/482631.png' />
                                 <span>{sugg}</span>
                              </li>
                           )
                        }
                     </ul>
                  </div>
               }
            </div>
            <div className='flex flex-row-reverse justify-around'>
               <div className='w-10 h-10 ml-5 cursor-pointer'>
                  <img className='mt-1 ml-2 h-7 rounded-full' alt='user-icon' src='https://w7.pngwing.com/pngs/178/595/png-transparent-user-profile-computer-icons-login-user-avatars-thumbnail.png' />
               </div>
               <div className='w-10 h-10 hover:rounded-full hover:bg-gray-100 ml-5 cursor-pointer relative'>
                  <img className='mt-2 ml-2' alt='bell-icon ' src={bellIcon} />
                  <div className='absolute bg-red-700 text-white w-6 h-5 rounded-2xl border-2 border-white top-[3px] left-5 text-xs text-center'>9+</div>
               </div>
               <div className='w-10 h-10 hover:rounded-full hover:bg-gray-100 ml-5 cursor-pointer'>
                  <img className='mt-2 ml-2' alt='create-icon ' src={createIcon} />
               </div>
            </div>
        </div>
    </div>

   
  );
};

export default Header;
