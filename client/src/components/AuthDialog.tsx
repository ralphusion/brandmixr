
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FcGoogle } from 'react-icons/fc';
import { FaApple } from 'react-icons/fa';

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'login' | 'signup';
}

export function AuthDialog({ isOpen, onClose, mode }: AuthDialogProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{mode === 'login' ? 'Login' : 'Sign Up'}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Button variant="outline" className="gap-2">
            <FcGoogle size={20} />
            Continue with Google
          </Button>
          <Button variant="outline" className="gap-2">
            <FaApple size={20} />
            Continue with Apple
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button>{mode === 'login' ? 'Login' : 'Sign Up'}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
