import { Copy as AssignmentIcon } from '@chia-network/icons';
import { Trans } from '@lingui/macro';
import { Tooltip, IconButton } from '@mui/material';
import { styled } from '@mui/material/styles';
import React, { useState } from 'react';
import { useCopyToClipboard } from 'react-use';
// @ts-ignore
import { useTimeout } from 'react-use-timeout';

const StyledAssignmentIcon = styled(({ invertColor, ...rest }) => <AssignmentIcon {...rest} />)(
  ({ theme, invertColor }) => `
  color: ${invertColor ? theme.palette.common.white : theme.palette.text.secondary};
`
);

export type CopyToClipboardProps = {
  value: string;
  fontSize?: 'medium' | 'small' | 'large' | 'inherit';
  size: 'small' | 'medium';
  clearCopiedDelay: number;
  invertColor?: boolean;
  color?: string;
  'data-testid'?: string;
};

export default function CopyToClipboard(props: CopyToClipboardProps) {
  const {
    value,
    size = 'small',
    fontSize = 'medium',
    clearCopiedDelay = 1000,
    invertColor = false,
    'data-testid': dataTestid,
    ...rest
  } = props;
  const [, copyToClipboard] = useCopyToClipboard();
  const [copied, setCopied] = useState<boolean>(false);
  const timeout = useTimeout(() => {
    setCopied(false);
  }, clearCopiedDelay);

  function handleCopy(event) {
    event.preventDefault();
    event.stopPropagation();

    copyToClipboard(value);
    setCopied(true);
    timeout.start();
  }

  const tooltipTitle = copied ? <Trans>Copied</Trans> : <Trans>Copy to Clipboard</Trans>;

  return (
    <Tooltip title={tooltipTitle}>
      <IconButton onClick={handleCopy} size={size} data-testid={dataTestid}>
        <StyledAssignmentIcon fontSize={fontSize} invertColor={invertColor} {...rest} />
      </IconButton>
    </Tooltip>
  );
}
