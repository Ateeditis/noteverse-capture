
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Clipboard } from 'react-native';
import { IconButton, Card, Button, Divider } from 'react-native-paper';
import { Note } from '@/lib/types';

interface NoteViewProps {
  navigation?: any;
    note: Note;
    onDelete?: (id: string) => void;
    showFullContent?: boolean;
    showActions?: boolean;
  note: Note;
  onDelete?: (id: string) => void;
  showFullContent?: boolean;
  showActions?: boolean;
  className?: string;
}

const NoteView: React.FC<NoteViewProps> = ({
  note,
  onDelete,
  showFullContent = false,
  showActions = false,
  className,
}) => {
  const { id, title, content, timestamp } = note;
  const formattedDate = new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  
  const copyToClipboard = () => {
    Clipboard.setString(content);
    // You could show a toast notification here
  };
  
  const processContent = (markdown: string) => {
    // Very basic markdown processing (for headings and lists)
    return markdown
        .split('\n')
        .map((line, i) => {
            if (line.startsWith('# ')) {
                return <Text key={i} style={styles.h1}>{line.substring(2)}</Text>;
            } else if (line.startsWith('## ')) {
                return <Text key={i} style={styles.h2}>{line.substring(3)}</Text>;
            } else if (line.startsWith('### ')) {
                return <Text key={i} style={styles.h3}>{line.substring(4)}</Text>;
            } else if (line.startsWith('- ')) {
                return (
                    <View key={i} style={styles.listItem}>
                        <Text style={styles.bullet}>•</Text>
                        <Text>{line.substring(2)}</Text>
                    </View>
                );
            } else if (line.trim() === '') {
                return <View key={i} style={styles.emptyLine} />;
            } else {
                return <Text key={i} style={styles.paragraph}>{line}</Text>;
            }
        });
  };
  
  const truncateContent = (content: string) => {
    // Extract first 100 characters, respecting word boundaries
    if (content.length <= 100) return content;
        return content.substring(0, 100).split(' ').slice(0, -1).join(' ') + '...';
  };
  
  return (
    <Card
      style={[
        styles.card,
        showFullContent ? styles.cardFullContent : styles.cardTruncated,
      ]}
    >
      {/* Note content */}
      <View>
        {!showFullContent ? (
            <TouchableOpacity onPress={() => navigation.navigate('ViewNote', { id })}>
            <Text style={styles.titleTruncated}>{title}</Text>
            <View style={styles.dateContainer}>
              {formattedDate}
            </View>
            <View style={styles.contentTruncated}>
              {truncateContent(content)}
            </View>
          </TouchableOpacity>
        ) : (
          <View>
            <Text style={styles.titleFull}>{title}</Text>
            <View style={styles.dateContainer}>
              {formattedDate}
            </View>
            <View style={styles.markdownContent}>
              {processContent(content)}
            </View>
          </View>
        )}
      </View>
      
      {/* Actions */}
      {showActions && (
        <View style={styles.actionsContainer}>
        <Divider style={styles.divider}/>
          <Button  onPress={copyToClipboard}>
            Copy
          </Button>
          <Button>
            Edit
          </Button>
          <Button>
            Favorite
          </Button>
          {onDelete && (
            <Button
            style={styles.deleteButton}
              onClick={() => onDelete(id)}
            >
              Delete
            </Button>
          )}
        </View>
      )}
    </Card>
  );
};

export default NoteView;

const styles = StyleSheet.create({
    card: {
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#e0e0e0',
    },
    cardFullContent: {
        padding: 20,
    },
    cardTruncated: {
        padding: 16,
    },
    titleTruncated: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
        lineHeight: 20,
    },
    dateContainer: {
        fontSize: 12,
        color: '#757575',
        marginBottom: 12,
    },
    contentTruncated: {
        fontSize: 14,
        color: '#757575',
        lineHeight: 20,
    },
    titleFull: {
        fontWeight: 'bold',
        fontSize: 20,
        marginBottom: 4,
    },
    markdownContent: {
        marginBottom: 24,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 8,
        marginTop: 20,
        paddingTop: 12,
    },
    h1: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 24,
        marginBottom: 12,
    },
    h2: {
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 8,
    },
    h3: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 8,
    },
    listItem: { flexDirection: 'row', alignItems: 'flex-start', marginVertical: 6 },
    bullet: { marginRight: 8, marginTop: 6 },
    emptyLine: { height: 12 },
    paragraph: { marginVertical: 8 },
    deleteButton:{color: 'red'}
});
