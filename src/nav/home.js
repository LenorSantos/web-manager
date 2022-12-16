import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { saveAs } from 'file-saver';

export function Home() {
    const [file, setfile] = useState([]);
    const [dir, setdir] = useState([]);

    function home() {
        axios.get("http://localhost:5001/home").then(result => {
            setfile(result.data.file);
            setdir(result.data.directories);
        });
    }

    function upfolder(a) {
        axios.post("http://localhost:5001/upfolder", {
            folder: a
        }).then(result => {
            setfile(result.data.file);
            setdir(result.data.directories);
        });
    }

    function downdir() {
        axios.get("http://localhost:5001/downdir").then(result => {
            setfile(result.data.file);
            setdir(result.data.directories);
        }).catch(err => {
            if (err.response.status === 405) {
                alert("ação impossível");
                home();
            }
        });
    }

    async function downfile(a) {
        const response = await axios.get('http://localhost:5001/download', {
            params: {
                filename: a
            },
            responseType: 'blob'
        });

        if (response.data.error) {
            console.error(response.data.error)
        } else {
            saveAs(response.data, a);
        }

    }

    function delfile(a) {
        axios.delete("http://localhost:5001/delfile", {
            params: {
                file: a
            }
        }).then(result => {
            if (result.status === 200) {
                upfolder();
            }
        })
    }

    function deldir(a) {
        axios.delete("http://localhost:5001/deldir", {
            params: {
                dir: a
            }
        }).then(result => {
            if (result.status === 200) {
                upfolder();
            }
        })
    }

    const refup = useRef();
    const [data, setdata] = useState([]);
    const formdata = new FormData();
    function upload() {
        for (var count = 0; count < data.length; count++) {
            formdata.append('data', data[count]);
        }
        axios.post("http://localhost:5001/upload", formdata).then(result => {
            if (result.status === 200) {
                upfolder();
            }
            refup.current.value = [];
        });
    }

    const reffolder = useRef();
    const [namefolder, setnamefolder] = useState("");
    function newfolder() {
        axios.post("http://localhost:5001/newfolder", {
            folder: namefolder
        }).then(result => {
            if (result.status === 200) {
                upfolder();
            }
            reffolder.current.value = "";
        })
    }

    useEffect(() => {
        home();
    }, []);

    return (
        <div className='sub-main'>
            <div className='btn'>
                <button onClick={downdir}>{"<"}</button>
                <button onClick={home}>Home</button>
            </div>
            <div className='container'>
                {dir.map((valdir) => {
                    return (
                        <div key={valdir.name} className='sub-container'>
                            <img className='icon' src='/icon/folder.png' alt='icon' />
                            <button className='name' onClick={(event) => {upfolder(event.target.innerHTML)}}>{valdir.name}</button>
                            <img className='trash-icon' onClick={(event) => { deldir(event.currentTarget.previousElementSibling.innerHTML) }} src='/icon/trash.png' alt='icon'/>
                        </div>
                    )
                })}
                {file.map((valfile) => {
                    return (
                        <div key={valfile.name} className='sub-container'>
                            <img className='icon' src='/icon/file.png' alt='icon' />
                            <button onClick={(event) => { downfile(event.target.innerHTML) }} className='name'>{valfile.name}</button>
                            <img className='trash-icon' onClick={(event) => { delfile(event.currentTarget.previousElementSibling.innerHTML) }} src='/icon/trash.png' alt='icon'/>
                            <p className='size'>Tamanho: {valfile.size}</p>
                        </div>
                    );
                })}
            </div>
            <div className='btn-bottom'>
                <div className='upload'>
                    <button onClick={upload}>Upload</button>
                    <input onChange={(event) => { setdata(event.target.files) }} ref={refup} type="file" multiple />
                </div>
                <div className='new-folder'>
                    <input type='text' onChange={(event) => {setnamefolder(event.target.value)}} ref={reffolder}></input>
                    <button onClick={newfolder}>New Folder</button>
                </div>
            </div>
        </div>
    );
}