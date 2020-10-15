import React, {useState, useEffect} from 'react';
import Grid from "@material-ui/core/Grid";
import {Paper} from "@material-ui/core";
import TextField from "@material-ui/core/TextField";

import rest from './Rest'
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import DeleteIcon from '@material-ui/icons/Delete';
import Typography from "@material-ui/core/Typography";

export const Publisher = ({setRoute, id}) => {

    const [publisher, setPublisher] = useState('')
    const [entries, setEntries] = useState([])
    const [newEntry, setNewEntry] = useState('')

    useEffect(() => {

        rest('publishers/' + id)
            .then(res => {

                if (res.status === 200) {
                    setPublisher(res.body.name)
                    setEntries(res.body.entries)
                }

            })


    }, [])

    const newId = () => {

        let i = 1;

        while (true) {

            if (entries.find(e => e.id === i)) i++
            else return i

        }

    }

    const handlePublisherName = value => {
        setPublisher(value)
    }

    const handleNewEntry = value => {
        setNewEntry(value)
    }

    const addEntry = (is_app = false) => {

        setEntries(prev => {

            let name = newEntry
            let id = newId()

            prev.push({
                id,
                name,
                is_app
            })

            return prev
        })

        setNewEntry('')

    }

    const deleteEntry = id => {

        setEntries(prev => prev.filter(e => e.id !== id))

    }

    const savePublisher = () => {

        rest('publishers/' + id, 'PUT', {
            name: publisher,
            entries
        })
            .then(res => {

                console.log(res)

            })

    }

    return publisher === ''
        ? <CircularProgress/>
        : <>
            <Grid container
                  style={{marginBottom: '1rem'}}
                  direction={"column"} alignItems={"center"} component={Paper}>

                <Grid container
                      direction="row"
                      justify="space-around"
                    // alignItems="center"
                >
                    <Grid item>
                        <IconButton onClick={() => setRoute('publishers')}>
                            <ArrowBackIcon/>
                        </IconButton>
                    </Grid>
                    <Grid item>
                        <TextField label="Publisher"
                                   onChange={e => handlePublisherName(e.target.value)}
                                   value={publisher}/>
                    </Grid>
                    <Grid item>
                    </Grid>
                </Grid>

                <Grid item
                      style={{margin: '1rem'}}
                >

                    <TextField label="New entry"
                               onChange={e => handleNewEntry(e.target.value)}
                               value={newEntry}/>

                    <Button variant="contained" color="primary"
                            style={{margin: '1rem'}}
                            disabled={newEntry === ''}
                            onClick={() => addEntry()}
                    >
                        add ads
                    </Button>

                    <Button variant="contained" color="primary"
                            style={{margin: '1rem'}}
                            disabled={newEntry === ''}
                            onClick={() => addEntry(true)}
                    >
                        add app-ads
                    </Button>


                </Grid>
                <Grid item
                      style={{margin: '1rem'}}
                >

                    <Button
                        variant="contained"
                        color="secondary"
                        style={{margin: '1rem'}}
                        onClick={() => setRoute('publishers')}
                    >
                        cancel
                    </Button>
                    <Button
                        variant="contained"
                        color="primary"
                        style={{margin: '1rem'}}
                        onClick={() => savePublisher()}
                    >
                        save
                    </Button>

                </Grid>
            </Grid>

            {
                [
                    {text: 'ads.txt', is_app: false},
                    {text: 'app-ads.txt', is_app: true},
                ].map(g => <Grid container
                                 key={'gridadsqwexunrfe' + g.text}
                                 style={{marginBottom: '1rem'}}
                                 direction={"column"} alignItems={"center"} component={Paper}
                >
                    <Typography variant={"h6"}>{g.text}</Typography>
                    <List>
                        {entries.filter(e => e.is_app === g.is_app)
                            .map(e => <ListItem key={'listentrfewfcsdkey' + e.name}>
                                    <ListItemText
                                        primary={e.name}
                                    />
                                    <ListItemSecondaryAction>
                                        <IconButton edge="end" aria-label="delete"
                                                    onClick={() => deleteEntry(e.id)}
                                        >
                                            <DeleteIcon/>
                                        </IconButton>
                                    </ListItemSecondaryAction>
                                </ListItem>
                            )}
                    </List>

                </Grid>)
            }
        </>

}