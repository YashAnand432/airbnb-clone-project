import { Link, useParams } from "react-router-dom";
import { useState } from "react";
import Perks from "../Perks";
import axios from "axios";
import { toFormData } from "axios";
import PhotosUploader from "../PhotosUploader";

function PlacesPage() {
  const { action } = useParams();
  const [title, setTitle] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [perks, setPerks] = useState('');
  const [checkin, setCheckin] = useState('');
  const [checkout, setCheckout] = useState('');
  const [maxguests, setMaxguests] = useState(1);
  const [extrainfo, setExtrainfo] = useState('');
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [photoLink, setPhotoLink] = useState('');
  
  function inputHeader(text) {
    return <h2 className="text-xl mt-4">{text}</h2>;
  }

  function inputDesc(text) {
    return <p className="text-sm">{text}</p>;
  }

  function preInput(header, description) {
    return (
      <div>
        {inputHeader(header)}
        {inputDesc(description)}
      </div>
    );
  }

  
  return (
    <div>
      {action !== 'new' && (
        <div className="text-center">
          <Link
            to={"/account/places/new"}
            className="bg-red-400 text-white inline-flex gap-1 mx-auto rounded-full py-2 px-4 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Add new Place
          </Link>
        </div>
      )}

      {action === 'new' && (
        <form>
          {preInput('Title', 'Title for your apartment. Should be short and catchy.')}
          <input type="text" placeholder="Title, ex: My lovely apartment" value={title} onChange={ev => setTitle(ev.target.value)} />

          {preInput('Address', 'Add your address in detail')}
          <input type="text" placeholder="Address" value={address} onChange={ev => setAddress(ev.target.value)} />

          {preInput('Photos', 'Add recent photos of your property. The more the better')}
          <PhotosUploader addedPhotos={addedPhotos} onChange={setAddedPhotos}/>

          {preInput('Description', 'Add a small description about your property')}
          <textarea value={description} onChange={ev => setDescription(ev.target.value)} />

          {preInput('Perks', 'Select all perks of your property.')}
          <div >
            <Perks selected={perks} onChange={setPerks} />
          </div>

          {preInput('Extra Info', 'House rules, etc.')}
          <textarea value={extrainfo} onChange={ev => setCheckin(ev.target.value)}/>

          {preInput('Check in & out times, Max Guests', 'Add check in & out times. Remember to have some time window for cleaning the room between guests.')}
          <div className="grid gap-2 sm:grid-cols-3">
            <div>
              <h3 className="mt-2 -mb-1">Check in time</h3>
              <input type="text" placeholder="14:00" value={checkin} onChange={ev => setCheckin(ev.target.value)} />
            </div>
            <div>
              <h3 className="mt-2 -mb-1">Check out time</h3>
              <input type="text" placeholder="11:00" value={checkout} onChange={ev => setCheckout(ev.target.value)} />
            </div>
            <div>
              <h3 className="my-2 -mb-1">Max number of guests</h3>
              <input type="number" placeholder="2" value={maxguests} onChange={ev => setMaxguests(ev.target.value)} />
            </div>
          </div>

          <div className="w-full flex items-center">
            <button className="bg-red-500 w-96 mx-auto rounded-2xl p-2 my-2">Save</button>
          </div>
        </form>
      )}
    </div>
  );
}

export default PlacesPage;
