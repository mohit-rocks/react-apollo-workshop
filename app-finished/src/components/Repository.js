import {
  Avatar,
  Chip,
  ListItem,
  ListItemAvatar,
  ListItemSecondaryAction,
  ListItemText,
  Typography
} from "@material-ui/core";
import Stars from "@material-ui/icons/Stars";
import React from "react";
import { Mutation } from "react-apollo";
import {
  ADD_STAR_MUTATION,
  REMOVE_STAR_MUTATION,
  REPOSITORY_FIELDS
} from "../graphql";

const StarRepo = ({ repoId, starsCount }) => (
  <Mutation mutation={ADD_STAR_MUTATION}>
    {(starRepoFn, result) => (
      <Chip
        label={`Star  ${starsCount}`}
        clickable
        color="primary"
        icon={<Stars />}
        onClick={async () => {
          await starRepoFn({
            update: (cache, { data }) => {
              cache.writeFragment({
                id: repoId,
                fragment: REPOSITORY_FIELDS,
                data: data.addStar.starrable
              });
            },
            optimisticResponse: {
              addStar: {
                __typename: "AddStarPayload",
                starrable: {
                  id: repoId,
                  viewerHasStarred: true,
                  __typename: "Repository"
                }
              }
            },
            variables: {
              repoId
            }
          });
        }}
      />
    )}
  </Mutation>
);

const UnstarRepo = ({ repoId, starsCount }) => (
  <Mutation mutation={REMOVE_STAR_MUTATION}>
    {(unstarRepo, result) => (
      <Chip
        label={`Unstar  ${starsCount}`}
        clickable
        icon={<Stars />}
        onClick={async () => {
          await unstarRepo({
            update: (cache, { data }) => {
              console.log(data);
              cache.writeFragment({
                id: repoId,
                fragment: REPOSITORY_FIELDS,
                data: data.removeStar.starrable
              });
            },
            optimisticResponse: {
              removeStar: {
                __typename: "RemoveStarPayload",
                starrable: {
                  id: repoId,
                  viewerHasStarred: false,
                  __typename: "Repository"
                }
              }
            },
            variables: {
              repoId
            }
          });
        }}
      />
    )}
  </Mutation>
);

export default function Repository({ repo }) {
  return (
    <React.Fragment>
      <ListItem alignItems="flex-start">
        <ListItemAvatar>
          <Avatar alt={repo.owner.login} src={repo.owner.avatarUrl} />
        </ListItemAvatar>
        <ListItemText
          primary={repo.name}
          secondary={
            <React.Fragment>
              <Typography component="span" color="textPrimary">
                {repo.owner.login}
              </Typography>
            </React.Fragment>
          }
        />
        <ListItemSecondaryAction>
          {!repo.viewerHasStarred ? (
            <StarRepo
              repoId={repo.id}
              starsCount={repo.stargazers.totalCount}
            />
          ) : (
            <UnstarRepo
              repoId={repo.id}
              starsCount={repo.stargazers.totalCount}
            />
          )}
        </ListItemSecondaryAction>
      </ListItem>
    </React.Fragment>
  );
}
