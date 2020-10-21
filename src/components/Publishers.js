import React, {useEffect, useState} from 'react';
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import {Paper} from "@material-ui/core";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import EditIcon from '@material-ui/icons/Edit';
import IconButton from "@material-ui/core/IconButton";
import FindInPageIcon from '@material-ui/icons/FindInPage';

import rest from './Rest'
import LinearProgress from "@material-ui/core/LinearProgress";

export const Publishers = ({setRoute, setPublisherId, setPublisher}) => {

    const [publishers, setPublishers] = useState([])
    const [newPublisher, setNewPublisher] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {

        setLoading(true)

        rest('publishers')
            .then(res => {

                setLoading(false)

                if (res.status === 200) setPublishers(res.body)

            })

    }, [])

    const handleNewPublisher = value => {
        setNewPublisher(value)
    }

    const addPublisher = () => {

        if (!newPublisher || loading) return;

        setLoading(true)

        rest('publishers', "POST", {newPublisher})
            .then(res => {

                setLoading(false)

                if (res.status === 201) {
                    setPublishers(res.body)
                    setNewPublisher('')
                }

            })

    }

    const editPublisher = id => {

        setPublisherId(id);
        setRoute('publisher')

    }

    const crawl = p => {

        setPublisher(p);
        setRoute('crawl')

    }

    return <Grid container
                 style={{marginBottom: '1rem'}}
                 direction={"column"} alignItems={"center"} component={Paper}>

        <Grid item>
            <Typography variant={"h5"}>Publishers</Typography>
        </Grid>
        <Grid item>

            <TextField label="New publisher"
                       onChange={e => handleNewPublisher(e.target.value)}
                       value={newPublisher}/>

            <Button variant="contained" color="primary"
                    style={{margin: '1rem'}}
                    disabled={newPublisher === '' || loading}
                    onClick={() => addPublisher()}
            >
                add publisher
            </Button>

            <List>
                {loading
                    ? <LinearProgress/>
                    : null}
                {publishers.map(p => <ListItem key={'listpublisherskey' + p.name}>
                        <ListItemText
                            primary={p.name}
                        />
                        <ListItemSecondaryAction
                            style={{padding: '1rem'}}
                        >
                            <IconButton edge="end"
                                        onClick={() => editPublisher(p.id)}
                            >
                                <EditIcon/>
                            </IconButton>

                            <IconButton edge="end"
                                        onClick={() => crawl(p)}
                            >
                                <FindInPageIcon/>
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>
                )}
            </List>

        </Grid>

        <Button variant="contained"
                color="primary"
                style={{margin: '1rem'}}
                onClick={() => setRoute('reports')}
        >
            reports
        </Button>
    </Grid>

}