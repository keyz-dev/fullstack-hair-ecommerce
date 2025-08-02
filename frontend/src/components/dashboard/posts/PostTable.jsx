import React, { useState } from 'react';
import { Table, Badge, Button, Input, Select } from '../../ui';
import { usePost } from '../../../hooks';
import { Edit, Trash2, BarChart3, Search, Filter } from 'lucide-react';
import { format } from 'date-fns';

const PostTable = ({ onEdit, onAnalytics, onDelete }) => {
  const { posts, filters, actions } = usePost();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    actions.setFilters({ search: searchTerm });
  };

  const handleFilterChange = (filterType, value) => {
    actions.setFilters({ [filterType]: value });
  };

  const getTypeBadgeColor = (type) => {
    const colors = {
      post: 'blue',
      story: 'purple',
      reel: 'pink',
      transformation: 'green',
      tutorial: 'orange',
      promotion: 'red'
    };
    return colors[type] || 'gray';
  };

  const getStatusBadgeColor = (status) => {
    const colors = {
      draft: 'gray',
      published: 'green',
      archived: 'red'
    };
    return colors[status] || 'gray';
  };

  const columns = [
    {
      Header: 'Post',
      accessor: 'title',
      Cell: ({ row }) => (
        <div className="flex items-center">
          <div className="flex-shrink-0 h-12 w-12">
            {row.images?.[0] ? (
              <img
                className="h-12 w-12 rounded-lg object-cover"
                src={row.images[0].url}
                alt={row.title}
              />
            ) : (
              <div className="h-12 w-12 rounded-lg bg-gray-200 flex items-center justify-center">
                <span className="text-gray-400 text-xs">No Image</span>
              </div>
            )}
          </div>
          <div className="ml-4">
            <div className="text-sm font-medium text-gray-900">
              {row.title}
            </div>
            <div className="text-sm text-gray-500">
              {row.excerpt || row.content.substring(0, 100)}...
            </div>
            {row.featured && (
              <Badge variant="yellow" className="mt-1">
                Featured
              </Badge>
            )}
          </div>
        </div>
      )
    },
    {
      Header: 'Type',
      accessor: 'type',
      Cell: ({ row }) => (
        <Badge variant={getTypeBadgeColor(row.type)}>
          {row.type}
        </Badge>
      )
    },
    {
      Header: 'Status',
      accessor: 'status',
      Cell: ({ row }) => (
        <Badge variant={getStatusBadgeColor(row.status)}>
          {row.status}
        </Badge>
      )
    },
    {
      Header: 'Engagement',
      accessor: 'engagement',
      Cell: ({ row }) => (
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center">
            <span className="mr-1">👁</span>
            {row.views}
          </div>
          <div className="flex items-center">
            <span className="mr-1">❤</span>
            {row.likes?.length || 0}
          </div>
          <div className="flex items-center">
            <span className="mr-1">💬</span>
            {row.comments?.length || 0}
          </div>
        </div>
      )
    },
    {
      Header: 'Published',
      accessor: 'publishedAt',
      Cell: ({ row }) => (
        <span className="text-sm text-gray-500">
          {format(new Date(row.publishedAt), 'MMM dd, yyyy')}
        </span>
      )
    },
    {
      Header: 'Actions',
      accessor: 'actions',
      Cell: ({ row }) => (
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClickHandler={() => onAnalytics(row)}
          >
            <BarChart3 size={14} />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClickHandler={() => onEdit(row)}
          >
            <Edit size={14} />
          </Button>
          <Button
            size="sm"
            variant="outline"
            onClickHandler={() => onDelete(row)}
          >
            <Trash2 size={14} />
          </Button>
        </div>
      )
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      {/* Filters and Search */}
      <div className="p-4 border-b">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <Input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>

          <div className="flex items-center space-x-4">
            <Select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="w-40"
            >
              <option value="">All Types</option>
              <option value="post">Posts</option>
              <option value="story">Stories</option>
              <option value="reel">Reels</option>
              <option value="transformation">Transformations</option>
              <option value="tutorial">Tutorials</option>
              <option value="promotion">Promotions</option>
            </Select>

            <Button
              variant="outline"
              onClickHandler={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter size={16} />
              Filters
            </Button>
          </div>
        </div>

        {showFilters && (
          <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-3 gap-4">
            <Select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">All Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </Select>

            <Select
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
            >
              <option value="publishedAt">Latest</option>
              <option value="views">Most Viewed</option>
              <option value="likes">Most Liked</option>
              <option value="comments">Most Commented</option>
            </Select>

            <Input
              type="number"
              placeholder="Posts per page"
              value={filters.limit || 10}
              onChange={(e) => actions.setPagination({ limit: parseInt(e.target.value) })}
              min="5"
              max="50"
            />
          </div>
        )}
      </div>

      {/* Table */}
      <Table columns={columns} data={posts} />
    </div>
  );
};

export default PostTable; 