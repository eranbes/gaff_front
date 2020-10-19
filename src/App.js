import React, {useState} from 'react';
import {Publishers} from "./components/Publishers";
import {Publisher} from "./components/Publisher";
import {Crawl} from "./components/Crawl";

function App() {

    const [route, setRoute] = useState('publishers');
    const [publisherId, setPublisherId] = useState(0);
    const [publisher, setPublisher] = useState([]);

    return route === 'publishers'
        ? <Publishers setRoute={setRoute} setPublisherId={setPublisherId} setPublisher={setPublisher}/>
        : route === 'publisher'
            ? <Publisher setRoute={setRoute} id={publisherId}/>
            : route === 'crawl'
                ? <Crawl setRoute={setRoute} publisher={publisher}/>
                : null

}

export default App;