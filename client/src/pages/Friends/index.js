import React, { useContext, useState, useEffect } from "react";
import {Form, Button, Alert } from "react-bootstrap";
import AuthContext from "../../contexts/AuthContext";
import FriendsDisplay from "../../components/FriendsDisplay";
import API from "../../lib/API";
import "./style.css";



const Friends = (props) => {
  const userInfo = useContext(AuthContext);    
    const [email, setEmail] = useState("") //searched email
    const [foundFriend, setFoundFriend] = useState({
      name: "",
      email: "",
      id: undefined
    }); //found email    
    const [error, setError] = useState(""); //error message
    const [isFriendFound, setIsFriendFound] = useState("No search yet"); //tracking what the user has done, if they have searched or not
    const [newFriend, setNewFriend] = useState(); //save found friend for further API calls
    const [serverMessage, setServerMessage] = useState("");
    const [followMessage, setFollowMessage] = useState("");
    const [alertVariant, setAlertVariant] = useState();
    const [show, setShow] = useState();    

    useEffect(() => {
      console.log("re-rendering")
    }, [show])
    
    const handleInput = event => {
      setEmail(event.target.value);    
    }
      
    const handleSubmit = event => {
      event.preventDefault();
        
      API.Users.searchForUser(email)    
        .then(res => {
          // console.log(res)
          if (res.data.status === "error") {
            throw setError(res.data.message);          
          } 
          setIsFriendFound("Friend found");
          setError({ results: res.data.message, error: "" });
          setFoundFriend({name: res.data.name, email: res.data.email, id: res.data.id})
          setNewFriend({name: res.data.name, email: res.data.email, id: res.data.id})         
          
        })
        .catch(err => {
          if (err.response.status === 404) {
            setIsFriendFound("No friend found");
          }
          setError({ error: err.message })
        });
        
    };
    
    
    const followFriend = () => {      
      API.Users.addToThoseIFollow(newFriend.id, userInfo.authToken)
      .then(response => {
        console.log(response)
        // if (response.data.status === "error") {
        //   throw setError(response.data.message);          
        // }
        if (response.data.status) {
          setFollowMessage("Successfully followed this friend!");
          setAlertVariant('success');
          setShow(true)
        }
      })
      .catch(err => {
        if (err.response.status === 404) {
          setError({ error: err.message })  
        }
        console.log(err)
      });
    }


    const inviteFriend = () => {
      console.log(email)
      API.Users.inviteFriend(email)
      .then(res =>{
        setServerMessage(res.data); //use this for alert. create alert hook
        setAlertVariant('success');
        setShow(true);
      })
      .catch(err => {
        // if (err.response.status === 404) {
          
        // }
        // setError({ error: err.message })
        console.log(err)
      });
    }

    return(
        <>
          <h3 className="h3_heading_dark">Search for a friend's email to follow them</h3>             
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formGroupEmail">            
              <Form.Control              
                placeholder="Your friend's email address"
                type="email"
                name="email"
                value={email}
                onChange={handleInput}
                required          
              />                           
            </Form.Group>
            <Button 
              className='btn btn_orange'
              type='submit'
              >Go!</Button>             
          </Form>          
          <div>
            { isFriendFound === "No search yet" ? <div></div> : isFriendFound === "No friend found" ?
            <div>
              <p className="p_text_dark">Looks like your friend has not joined Smaller Footprint. You can invite them to join and create their own Challenge to lessen their carbon footprint!
              </p>
              <Button 
                className='btn btn_orange'
                type='submit'
                onClick={inviteFriend}
                >Send invitation
              </Button>               
              <Alert style={{ opacity: show ? 1 : 0, marginBottom: 10 }} variant={alertVariant} className="mt-3 mb-3" onClick={() => setShow(false)} show={show} dismissible>{serverMessage}
              </Alert>      
            </div> : isFriendFound === "Friend found" ?
            <div>          
              <p className="p_text_dark"> We found your friend!</p>
              <p className="p_text_dark">{foundFriend.name}</p>
              <p className="p_text_dark">{foundFriend.email}</p>
              <Button 
                className='btn btn_orange'
                type='submit'
                onClick={followFriend}
                >Follow friend
              </Button>
              <Alert style={{ opacity: show ? 1 : 0, marginBottom: 10 }} variant={alertVariant} className="mt-3 mb-3" onClick={() => setShow(false)} show={show}  dismissible>{followMessage}
              </Alert>
            </div> :  <div></div> }              
          </div>
          <div className="mt-3 mb-3">
          <FriendsDisplay/>
          </div>
        </>
    )
}
  
export default Friends;
