'use client';

// Migrated from src/pages/Profile.tsx
// No router usage needed — pure display component

import { useAuthStore } from '@/store/authStore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/common/Avatar';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/utils';
import { Mail, Calendar, Coins, Shield } from 'lucide-react';

export default function Profile() {
  const user = useAuthStore((s) => s.user);
  if (!user) return null;

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Perfil</h1>
        <p className="text-muted-foreground mt-1">Tu información de cuenta</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-5">
            <Avatar src={user.avatar} name={user.name} size="lg" />
            <div>
              <h2 className="text-xl font-bold">{user.name}</h2>
              <p className="text-muted-foreground text-sm">{user.email}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="brand" className="gap-1">
                  <Coins className="h-3 w-3" />
                  {user.credits} créditos
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Detalles de cuenta</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <InfoRow icon={Mail} label="Email" value={user.email} />
          <InfoRow icon={Calendar} label="Miembro desde" value={formatDate(user.createdAt)} />
          <InfoRow icon={Shield} label="Autenticación" value="Google OAuth" />
          <InfoRow icon={Coins} label="Créditos disponibles" value={`${user.credits} créditos`} />
        </CardContent>
      </Card>
    </div>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 py-2 border-b border-white/[0.06] last:border-0">
      <div className="rounded-lg bg-muted p-2">
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <div className="flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}
