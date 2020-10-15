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

export const Domains = () => {

    const [domains, setDomains] = useState([])
    const [newDomain, setNewDomain] = useState([])

    useEffect(() => {

        rest('domains')
            .then(res => {

                if (res.status === 200) setDomains(res.body)

            })

    }, [])

    const handleNewDomain = value => {
        setNewDomain(value)
    }

    const addDomain = () => {

        rest('domains', "POST", {newDomain})
            .then(res => {

                if (res.status === 201) {
                    setDomains(res.body)
                    setNewDomain('')
                }

            })

    }

    return <Grid container
                 style={{marginBottom: '1rem'}}
                 direction={"column"} alignItems={"center"} component={Paper}>

        <Grid item>
            <Typography variant={"h5"}>Domains</Typography>
        </Grid>
        <Grid item>

            <TextField label="New domain"
                       onChange={e => handleNewDomain(e.target.value)}
                       value={newDomain}/>

            <Button variant="contained" color="primary"
                    style={{margin: '1rem'}}
                    onClick={() => addDomain()}
            >
                add domain
            </Button>

            <List>
                {domains.map(d => <ListItem key={'listdomainskey' + d.name}>
                        <ListItemText
                            primary={d.name}
                        />
                    <ListItemSecondaryAction>
                        <IconButton edge="end" aria-label="delete"
                                    // onClick={() => deleteDomain(d.id)}
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