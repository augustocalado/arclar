import type { Metadata } from 'next';
import FormularioCadastro from '@/components/auth/FormularioCadastro';

export const metadata: Metadata = {
  title: 'Criar Conta – ARC LAR',
};

interface PageProps {
  searchParams: Promise<{ plano?: string }>;
}

export default async function CadastroPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const plano = params?.plano || 'gratuito';

  return <FormularioCadastro plano={plano} />;
}
