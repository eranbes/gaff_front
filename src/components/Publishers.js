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

import rest from './Rest'

export const Publishers = () => {

    const [publishers, setPublishers] = useState([])
    const [newPublisher, setNewPublisher] = useState([])

    useEffect(() => {

        rest('publishers')
            .then(res => {

                console.log(res)

                setPublishers(res.body)

            })

    }, [])

    const handleNewPublisher = value => {
        setNewPublisher(value)
    }

    const addPublisher = () => {

        rest('publishers', "POST", {newPublisher})
            .then(res => {

                if (res.status === 201) {
                    setPublishers(res.body)
                    setNewPublisher('')
                }
            })

    }

    console.log('publishers', publishers)

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
                    onClick={() => addPublisher()}
            >
                add publisher
            </Button>

            <List>
                {publishers.map(d => <ListItem key={'listpublisherskey' + d.name}>
                        <ListItemText
                            primary={d.name}
                        />
                        <ListItemSecondaryAction>
                            <IconButton edge="end" aria-label="delete"
                                // onClick={() => deletePublisher(d.id)}
                            >
                                <EditIcon />
                            </IconButton>
                        </ListItemSecondaryAction>
                    </ListItem>

                )}
            </List>
        </Grid>
    </Grid>

}