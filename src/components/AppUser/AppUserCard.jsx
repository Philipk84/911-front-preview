import { Card, CardContent, Stack, Typography } from '@mui/material'

const AppUserCard = ({ appUser }) => {
  if (!appUser) return null

  return (
    <Card className="mini-user-card">
      <CardContent>
        <Stack spacing={0.5}>
          <Typography variant="subtitle2" fontWeight={800}>
            {appUser.firstName} {appUser.lastName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {appUser.email}
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  )
}

export default AppUserCard
