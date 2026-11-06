import { Imovel } from '@/types';

export interface XMLSyncResult {
  totalLidos: number;
  inseridos: number;
  atualizados: number;
  removidos: number;
  erros: string[];
}

export function parseXMLImoveis(xmlText: string): Partial<Imovel>[] {
  const imoveis: Partial<Imovel>[] = [];

  // Regex robusto para extrair tags de listagem VivaReal / Zap / ARC LAR
  const listingRegex = /<(Listing|Imovel|Item)>([\s\S]*?)<\/(Listing|Imovel|Item)>/gi;
  let match;

  while ((match = listingRegex.exec(xmlText)) !== null) {
    const bloco = match[2];

    const getVal = (tag: string): string => {
      const tagMatch = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i').exec(bloco);
      return tagMatch ? tagMatch[1].replace(/<!\[CDATA\[(.*?)\]\]>/gi, '$1').trim() : '';
    };

    const codigoRef = getVal('ListingID') || getVal('CodigoImovel') || getVal('ID') || `XML_${Date.now()}`;
    const titulo = getVal('Title') || getVal('Titulo') || `Imóvel Ref. ${codigoRef}`;
    const preco = parseFloat(getVal('Price') || getVal('PrecoVenda') || getVal('Preco') || '0');
    const transactionType = (getVal('TransactionType') || getVal('TipoNegocio') || 'Sale').toLowerCase();
    const negocio = transactionType.includes('rent') || transactionType.includes('aluguel') || transactionType.includes('locacao') ? 'aluguel' : 'venda';
    
    const rawTipo = (getVal('PropertyType') || getVal('Tipo') || 'Apartamento').toLowerCase();
    let tipo: any = 'apartamento';
    if (rawTipo.includes('casa')) tipo = 'casa';
    else if (rawTipo.includes('terreno') || rawTipo.includes('lote')) tipo = 'terreno';
    else if (rawTipo.includes('cobertura')) tipo = 'cobertura';
    else if (rawTipo.includes('comercial') || rawTipo.includes('sala')) tipo = 'comercial';

    // Imagens
    const fotos: string[] = [];
    const itemFotoRegex = /<(Item|URL)[^>]*>([\s\S]*?)<\/(Item|URL)>/gi;
    let fotoMatch;
    while ((fotoMatch = itemFotoRegex.exec(bloco)) !== null) {
      const url = fotoMatch[2].replace(/<!\[CDATA\[(.*?)\]\]>/gi, '$1').trim();
      if (url.startsWith('http')) fotos.push(url);
    }

    imoveis.push({
      codigo_ref: codigoRef,
      titulo,
      descricao: getVal('Description') || getVal('Descricao'),
      preco,
      negocio,
      tipo,
      area_construida: parseFloat(getVal('LivingArea') || getVal('AreaUtil') || '0') || undefined,
      area_total: parseFloat(getVal('TotalArea') || getVal('AreaTotal') || '0') || undefined,
      quartos: parseInt(getVal('Bedrooms') || getVal('Quartos') || '0', 10),
      banheiros: parseInt(getVal('Bathrooms') || getVal('Banheiros') || '0', 10),
      vagas: parseInt(getVal('Garage') || getVal('Vagas') || '0', 10),
      foto_principal: fotos[0] || 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
      fotos,
      endereco: {
        logradouro: getVal('Address') || getVal('Logradouro') || '',
        numero: getVal('StreetNumber') || getVal('Numero') || '',
        bairro: getVal('Neighborhood') || getVal('Bairro') || 'Centro',
        cidade: getVal('City') || getVal('Cidade') || 'São Paulo',
        estado: getVal('State') || getVal('Estado') || 'São Paulo',
        estado_sigla: (getVal('State') || 'SP').slice(0, 2).toUpperCase(),
        cep: getVal('PostalCode') || getVal('CEP') || '',
      },
      status: 'ativo',
      destaque: false,
    });
  }

  return imoveis;
}

