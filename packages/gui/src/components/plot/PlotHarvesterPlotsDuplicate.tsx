import React, { useState, useMemo } from 'react';
import { Trans } from '@lingui/macro';
import { TableControlled } from '@chia/core';
import { type Plot } from '@chia/api';
import { useGetHarvesterPlotsDuplicatesQuery, useGetHarvesterQuery } from '@chia/api-react';
import { Typography } from '@mui/material';
import PlotAction from './PlotAction';

const cols = [
  {
    field: 'filename',
    tooltip: 'filename',
    title: <Trans>Filename</Trans>,
  },
  {
    width: '150px',
    field: (plot: Plot) => <PlotAction plot={plot} />,
    title: <Trans>Action</Trans>,
  },
];

export type PlotHarvesterPlotsDuplicateProps = {
  peerId: string;
};

export default function PlotHarvesterPlotsDuplicate(props: PlotHarvesterPlotsDuplicateProps) {
  const { peerId } = props;
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(5);
  const subPeerId = peerId.substring(2);
  const { duplicates, isLoading: isLoadingHarvester } = useGetHarvesterQuery({
    peerId,
  });
  const { isLoading: isLoadingHarvesterPlots, data = [] } = useGetHarvesterPlotsDuplicatesQuery({
    peerId: subPeerId,
    page,
    pageSize,
  });

  const rows = useMemo(() => {
    return data?.map((filename) => ({ filename }));
  }, [data]);

  const isLoading = isLoadingHarvester || isLoadingHarvesterPlots;
  const count = duplicates ?? 0;

  function handlePageChange(rowsPerPage: number, page: number) {
    setPageSize(rowsPerPage);
    setPage(page);
  }

  return (
    <TableControlled
      cols={cols}
      rows={rows}
      rowsPerPageOptions={[5, 10, 25, 50, 100]}
      page={page}
      rowsPerPage={pageSize}
      count={count}
      onPageChange={handlePageChange}
      isLoading={isLoading}
      expandedCellShift={1}
      uniqueField="filename"
      caption={!duplicates && (
        <Typography variant="body2" align="center">
          <Trans>Hooray, no files here!</Trans>
        </Typography>
      )}
      pages={!!duplicates}
    />
  );
}
